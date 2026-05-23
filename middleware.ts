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
const POLICY_CACHE_MS = 2000;

type PolicyCache = {
    expires: number;
    restrictEnabled: boolean;
    allowedIps: string[];
};

type LoadPolicyResult =
    | { ok: true; restrictEnabled: boolean; allowedIps: string[] }
    | { ok: false; restrictEnabled?: boolean; allowedIps?: string[] };

let policyCache: PolicyCache | null = null;

function getRequestHostname(request: NextRequest): string {
    try {
        const fromUrl = request.nextUrl.hostname?.trim().toLowerCase();

        if (fromUrl) {
            return fromUrl;
        }
    } catch {
        // ignore
    }

    const hostHeader = request.headers.get("host") ?? "";

    return hostHeader.split(":")[0]!.trim().toLowerCase();
}

function isLoopbackHostname(hostname: string): boolean {
    const h = hostname.toLowerCase();

    return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "::1";
}

/** Loopback, RFC1918 LAN, mDNS `.local`, single-label machine names (local dev). */
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

    const parts = h.split(".");

    if (parts.length === 4) {
        const a = Number(parts[0]);
        const b = Number(parts[1]);

        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            return false;
        }

        if (a === 10) return true;
        if (a === 172 && b >= 16 && b <= 31) return true;
        if (a === 192 && b === 168) return true;
        if (a === 127) return true;
        if (a === 100 && b >= 64 && b <= 127) return true;
    }

    return false;
}

/** Skip IP gate only on local dev machines — production Amplify hostnames always check DB policy. */
function isProductionDeployedHost(request: NextRequest): boolean {
    return !isLocalDevHost(getRequestHostname(request));
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

    const record = json as { restrictEnabled?: unknown; allowedIps?: unknown };

    return {
        restrictEnabled: Boolean(record.restrictEnabled),
        allowedIps: Array.isArray(record.allowedIps)
            ? record.allowedIps.map((ip) => String(ip).trim()).filter(Boolean)
            : [],
    };
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
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const res = await fetch(new URL("/api/public/site-access", origin).toString(), {
            cache: "no-store",
            headers: { Accept: "application/json" },
            signal: controller.signal,
        });

        if (!res.ok) {
            if (policyCache) {
                return {
                    ok: false,
                    restrictEnabled: policyCache.restrictEnabled,
                    allowedIps: policyCache.allowedIps,
                };
            }

            return { ok: false };
        }

        const parsed = parsePolicyJson(await res.json());

        if (!parsed) {
            if (policyCache) {
                return {
                    ok: false,
                    restrictEnabled: policyCache.restrictEnabled,
                    allowedIps: policyCache.allowedIps,
                };
            }

            return { ok: false };
        }

        policyCache = {
            expires: now + POLICY_CACHE_MS,
            restrictEnabled: parsed.restrictEnabled,
            allowedIps: parsed.allowedIps,
        };

        return { ok: true, ...parsed };
    } catch {
        if (policyCache) {
            return {
                ok: false,
                restrictEnabled: policyCache.restrictEnabled,
                allowedIps: policyCache.allowedIps,
            };
        }

        return { ok: false };
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
            return withNoStore(NextResponse.next());
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
        return withNoStore(NextResponse.next());
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
        return NextResponse.next();
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
