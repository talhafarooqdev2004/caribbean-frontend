import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Site IP restriction — controlled ONLY by Admin → Site access (MongoDB toggle).
 * No env vars enable or disable this feature.
 *
 * On production hosts (not localhost/LAN), middleware loads policy from
 * `/api/public/site-access` (same Amplify app → EC2 → DB). When restriction is off
 * in admin, everyone sees the site. When on, only allowlisted IPv4s pass.
 */
const POLICY_CACHE_MS = 15000;
const POLICY_FETCH_TIMEOUT_MS = 4000;

/** Inlined at Amplify build from NEXT_PUBLIC_CARIB_BACKEND_URL (.env.production). */
const BACKEND_API_BASE = (process.env.NEXT_PUBLIC_CARIB_BACKEND_URL || "").replace(/\/$/, "");

type PolicyCache = {
    expires: number;
    restrictEnabled: boolean;
    allowedIps: string[];
};

type LoadPolicyResult =
    | { ok: true; restrictEnabled: boolean; allowedIps: string[] }
    | { ok: false; restrictEnabled?: boolean; allowedIps?: string[] };

let policyCache: PolicyCache | null = null;

/** Public hostname from the client request (not Amplify/CloudFront internal routing). */
function getPublicHostname(request: NextRequest): string {
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().toLowerCase();

    if (forwardedHost) {
        return forwardedHost.split(":")[0]!;
    }

    const hostHeader = request.headers.get("host")?.trim().toLowerCase();

    if (hostHeader) {
        return hostHeader.split(":")[0]!;
    }

    try {
        return request.nextUrl.hostname?.trim().toLowerCase() ?? "";
    } catch {
        return "";
    }
}

function isLoopbackHostname(hostname: string): boolean {
    const h = hostname.toLowerCase();

    return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "::1";
}

/** localhost, .local, single-label machine names — skip IP gate for local dev only. */
function isLocalDevHost(hostname: string): boolean {
    if (!hostname) {
        return false;
    }

    if (isLoopbackHostname(hostname)) {
        return true;
    }

    if (hostname === "0.0.0.0") {
        return true;
    }

    if (hostname.endsWith(".local") || hostname.endsWith(".localhost")) {
        return true;
    }

    if (!hostname.includes(".") && /^[a-z0-9-]+$/i.test(hostname) && hostname.length <= 63) {
        return true;
    }

    const h = hostname.replace(/^\[|\]$/g, "").toLowerCase();

    if (h === "::1" || h.startsWith("fe80:")) {
        return true;
    }

    return false;
}

/** Run IP gate on real domains (e.g. caribnewswire.com). Do not use RFC1918 checks — Amplify edge uses internal 172.x routing. */
function isProductionDeployedHost(request: NextRequest): boolean {
    return !isLocalDevHost(getPublicHostname(request));
}

function parseCloudFrontViewerAddress(raw: string | null): string {
    if (!raw) {
        return "";
    }

    const t = raw.trim();
    const bracket = /^\[([^\]]+)\](?::\d+)?$/.exec(t);

    if (bracket?.[1]) {
        return bracket[1].trim();
    }

    const ipv4WithPort = /^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/.exec(t);

    if (ipv4WithPort?.[1]) {
        return ipv4WithPort[1].trim();
    }

    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(t)) {
        return t;
    }

    return "";
}

function normalizeIp(raw: string): string {
    return raw.trim().replace(/^::ffff:/i, "");
}

function isIpv4(value: string): boolean {
    return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(value);
}

function getClientIp(request: NextRequest): string {
    const headerCandidates = [
        "cloudfront-viewer-address",
        "CloudFront-Viewer-Address",
        "true-client-ip",
        "True-Client-IP",
        "x-real-ip",
        "cf-connecting-ip",
    ];

    for (const name of headerCandidates) {
        const raw = request.headers.get(name);

        if (!raw) {
            continue;
        }

        if (name.toLowerCase().includes("cloudfront-viewer-address")) {
            const fromCf = parseCloudFrontViewerAddress(raw);

            if (fromCf && isIpv4(fromCf)) {
                return normalizeIp(fromCf);
            }

            continue;
        }

        const first = raw.split(",")[0]?.trim();

        if (first && isIpv4(normalizeIp(first))) {
            return normalizeIp(first);
        }
    }

    const forwarded = request.headers.get("x-forwarded-for");

    if (forwarded) {
        for (const part of forwarded.split(",")) {
            const candidate = normalizeIp(part);

            if (isIpv4(candidate)) {
                return candidate;
            }
        }
    }

    return "";
}

function withNoStore(response: NextResponse): NextResponse {
    response.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set(
        "Vary",
        "CloudFront-Viewer-Address, True-Client-IP, X-Forwarded-For, X-Real-IP",
    );

    return response;
}

function parsePolicyJson(json: unknown): { restrictEnabled: boolean; allowedIps: string[] } | null {
    if (!json || typeof json !== "object") {
        return null;
    }

    const record = json as {
        restrictEnabled?: unknown;
        allowedIps?: unknown;
        data?: unknown;
    };

    const nested =
        record.data && typeof record.data === "object"
            ? (record.data as { restrictEnabled?: unknown; allowedIps?: unknown })
            : null;

    const source = nested ?? record;

    return {
        restrictEnabled: Boolean(source.restrictEnabled),
        allowedIps: Array.isArray(source.allowedIps)
            ? source.allowedIps.map((ip) => String(ip).trim()).filter(Boolean)
            : [],
    };
}

function cachePolicy(now: number, parsed: { restrictEnabled: boolean; allowedIps: string[] }) {
    policyCache = {
        expires: now + POLICY_CACHE_MS,
        restrictEnabled: parsed.restrictEnabled,
        allowedIps: parsed.allowedIps,
    };
}

async function fetchPolicyFromUrl(url: string, signal: AbortSignal): Promise<{ restrictEnabled: boolean; allowedIps: string[] } | null> {
    const res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        return null;
    }

    return parsePolicyJson(await res.json());
}

async function loadPolicy(origin: string): Promise<LoadPolicyResult> {
    const now = Date.now();

    if (policyCache && policyCache.expires > now) {
        return {
            ok: true,
            restrictEnabled: policyCache.restrictEnabled,
            allowedIps: policyCache.allowedIps,
        };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), POLICY_FETCH_TIMEOUT_MS);

    const staleFallback = (): LoadPolicyResult => {
        if (policyCache) {
            return {
                ok: false,
                restrictEnabled: policyCache.restrictEnabled,
                allowedIps: policyCache.allowedIps,
            };
        }

        return { ok: false };
    };

    try {
        const policyUrls: string[] = [];

        if (BACKEND_API_BASE) {
            policyUrls.push(`${BACKEND_API_BASE}/api/v1/site-access`);
        }

        policyUrls.push(new URL("/api/public/site-access", origin).toString());

        for (const url of policyUrls) {
            try {
                const parsed = await fetchPolicyFromUrl(url, controller.signal);

                if (parsed) {
                    cachePolicy(now, parsed);

                    return { ok: true, ...parsed };
                }
            } catch {
                // try next source
            }
        }

        return staleFallback();
    } catch {
        return staleFallback();
    } finally {
        clearTimeout(timeoutId);
    }
}

function isIpAllowed(ip: string, allowedIps: string[]): boolean {
    return Boolean(ip && allowedIps.includes(ip));
}

function redirectToMaintenance(request: NextRequest, reason: string): NextResponse {
    const response = NextResponse.redirect(new URL("/maintenance", request.url), 307);
    response.headers.set("x-site-gate", reason);

    return withNoStore(response);
}

async function evaluateAccess(request: NextRequest): Promise<NextResponse | null> {
    const policy = await loadPolicy(request.nextUrl.origin);

    if (!policy.ok) {
        if (policy.restrictEnabled === false) {
            const response = withNoStore(NextResponse.next());
            response.headers.set("x-site-gate", "open-stale");

            return response;
        }

        if (policy.restrictEnabled === true) {
            const ip = getClientIp(request);

            if (isIpAllowed(ip, policy.allowedIps ?? [])) {
                const response = withNoStore(NextResponse.next());
                response.headers.set("x-site-gate", "allow-stale");

                return response;
            }

            return redirectToMaintenance(request, "policy-stale-deny");
        }

        return redirectToMaintenance(request, "policy-unavailable");
    }

    if (!policy.restrictEnabled) {
        const response = withNoStore(NextResponse.next());
        response.headers.set("x-site-gate", "open");

        return response;
    }

    const ip = getClientIp(request);

    if (isIpAllowed(ip, policy.allowedIps)) {
        const response = withNoStore(NextResponse.next());
        response.headers.set("x-site-gate", "allow");

        return response;
    }

    return redirectToMaintenance(request, ip ? "deny" : "no-ip");
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith("/api/public/site-access")
        || pathname.startsWith("/api/payments/square/square-js")
        || pathname.startsWith("/_next/")
        || pathname === "/favicon.ico"
        || /\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?)$/i.test(pathname)
    ) {
        return NextResponse.next();
    }

    if (!isProductionDeployedHost(request)) {
        const response = NextResponse.next();
        response.headers.set("x-site-gate", "dev-skip");

        return response;
    }

    if (pathname.startsWith("/maintenance")) {
        const policy = await loadPolicy(request.nextUrl.origin);
        const ip = getClientIp(request);

        if (policy.ok && !policy.restrictEnabled) {
            return withNoStore(NextResponse.redirect(new URL("/", request.url), 307));
        }

        if (policy.ok && policy.restrictEnabled && isIpAllowed(ip, policy.allowedIps)) {
            return withNoStore(NextResponse.redirect(new URL("/", request.url), 307));
        }

        return withNoStore(NextResponse.next());
    }

    const decision = await evaluateAccess(request);

    return decision ?? withNoStore(NextResponse.next());
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
