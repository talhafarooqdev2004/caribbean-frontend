import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * IP allowlist for the public site (Edge middleware).
 *
 * **Local / LAN** (loopback, RFC1918, `.local`, `.localhost`): the IP gate runs only when
 * `SITE_IP_ALLOWLIST_ENFORCE=true` in `caribbean_news/.env.local`. This stays correct even when Edge reports
 * `NODE_ENV=production` during `next dev`.
 *
 * **Production hosting**
 * - **Vercel**: `VERCEL=1` (set automatically).
 * - **AWS Amplify**: `AMPLIFY_HOSTING=1` is written in `amplify.yml` at build time (no extra env needed for the gate to run).
 * - **Other servers**: set `SITE_IP_ALLOWLIST_ALWAYS_APPLY=true` on the Next server.
 *
 * **Local testing** of maintenance / allowlist: `SITE_IP_ALLOWLIST_ENFORCE=true`.
 *
 * **Local bypass**: set `SITE_IP_ALLOWLIST_DISABLE=true` in `.env.local` (recommended while developing).
 * If you still land on `/maintenance` after a redirect, middleware sends you back to `/` when the gate is off.
 */
const CACHE_TTL_MS = process.env.NODE_ENV === "development" ? 4000 : 12_000;

type PolicyCache = {
    expires: number;
    restrictEnabled: boolean;
    allowedIps: string[];
};

let policyCache: PolicyCache | null = null;

const envFlagTrue = (value: string | undefined) => {
    if (!value) {
        return false;
    }

    const normalized = value.trim().replace(/^["']|["']$/g, "").toLowerCase();

    return normalized === "true" || normalized === "1" || normalized === "yes";
};

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

/**
 * Loopback, RFC1918 LAN, IPv6 link-local, mDNS `.local`, reserved `.localhost` (RFC 6761).
 */
function isLocalLikeHostname(hostname: string): boolean {
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

    /**
     * `http://my-machine:3000` (no dots) is common on Windows / LAN; treat like local unless it looks like a TLD.
     */
    if (!hostname.includes(".") && /^[a-z0-9-]+$/i.test(hostname) && hostname.length <= 63) {
        return true;
    }

    const h = hostname.replace(/^\[|\]$/g, "").toLowerCase();

    if (h === "::1") {
        return true;
    }

    if (h.startsWith("fe80:")) {
        return true;
    }

    const parts = h.split(".");

    if (parts.length === 4) {
        const a = Number(parts[0]);
        const b = Number(parts[1]);

        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            return false;
        }

        if (a === 10) {
            return true;
        }

        if (a === 172 && b >= 16 && b <= 31) {
            return true;
        }

        if (a === 192 && b === 168) {
            return true;
        }

        if (a === 127) {
            return true;
        }

        if (a === 100 && b >= 64 && b <= 127) {
            return true;
        }
    }

    return false;
}

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");

    if (forwarded) {
        const first = forwarded.split(",")[0]?.trim();

        if (first) {
            return first;
        }
    }

    const realIp = request.headers.get("x-real-ip")?.trim();

    if (realIp) {
        return realIp;
    }

    return "";
}

/**
 * When false, middleware never fetches policy / never redirects to maintenance for IP reasons.
 */
function shouldRunSiteIpAllowlist(request: NextRequest): boolean {
    if (envFlagTrue(process.env.SITE_IP_ALLOWLIST_DISABLE)) {
        return false;
    }

    const enforce = envFlagTrue(process.env.SITE_IP_ALLOWLIST_ENFORCE);

    /**
     * Same machine / LAN: never apply unless ENFORCE=true (covers Edge `NODE_ENV=production` during `next dev`
     * and `next start` on localhost).
     */
    if (isLocalLikeHostname(getRequestHostname(request)) && !enforce) {
        return false;
    }

    if (process.env.NODE_ENV === "development" && !enforce) {
        return false;
    }

    if (enforce) {
        return true;
    }

    if (process.env.VERCEL === "1") {
        return true;
    }

    if (envFlagTrue(process.env.SITE_IP_ALLOWLIST_ALWAYS_APPLY)) {
        return true;
    }

    if (envFlagTrue(process.env.AMPLIFY_HOSTING)) {
        return true;
    }

    return false;
}

async function loadPolicy(origin: string): Promise<{ restrictEnabled: boolean; allowedIps: string[] }> {
    const now = Date.now();

    if (policyCache && policyCache.expires > now) {
        return {
            restrictEnabled: policyCache.restrictEnabled,
            allowedIps: policyCache.allowedIps,
        };
    }

    const secret = process.env.MW_SITE_ACCESS_SECRET || "dev-insecure";
    const url = new URL("/api/internal/site-access", origin);

    try {
        const res = await fetch(url, {
            cache: "no-store",
            headers: { "x-mw-site-access": secret },
        });
        const json = (await res.json()) as {
            restrictEnabled?: boolean;
            allowedIps?: string[];
        };

        const restrictEnabled = Boolean(json.restrictEnabled);
        const allowedIps = Array.isArray(json.allowedIps)
            ? json.allowedIps.map((ip) => String(ip).trim()).filter(Boolean)
            : [];

        policyCache = {
            expires: now + CACHE_TTL_MS,
            restrictEnabled,
            allowedIps,
        };

        return { restrictEnabled, allowedIps };
    } catch {
        policyCache = {
            expires: now + CACHE_TTL_MS,
            restrictEnabled: false,
            allowedIps: [],
        };

        return { restrictEnabled: false, allowedIps: [] };
    }
}

/**
 * TEMPORARY testing gate — set to `false` or remove after you are done (~1 hour).
 * When `true`: every request (except `/maintenance`, `/_next/*`, internal site-access, favicon, common static ext)
 * redirects to `/maintenance` so you can verify the page locally without IP allowlist.
 * Runs first so it does not fight the `/maintenance` → `/` bounce when IP allowlist is off on localhost.
 */
const TEMP_FORCE_MAINTENANCE_FOR_TESTING = true;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (TEMP_FORCE_MAINTENANCE_FOR_TESTING) {
        if (pathname.startsWith("/maintenance")) {
            return NextResponse.next();
        }

        if (
            pathname.startsWith("/api/internal/site-access")
            || pathname.startsWith("/_next/")
            || pathname === "/favicon.ico"
            || /\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?)$/i.test(pathname)
        ) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL("/maintenance", request.url), 307);
    }

    /**
     * `/maintenance` must not short-circuit before `shouldRunSiteIpAllowlist`, otherwise a previous redirect
     * leaves users stuck here forever when the IP gate is off locally (DISABLE / localhost / etc.).
     */
    if (pathname.startsWith("/maintenance")) {
        if (!shouldRunSiteIpAllowlist(request)) {
            return NextResponse.redirect(new URL("/", request.url), 307);
        }

        return NextResponse.next();
    }

    if (
        pathname.startsWith("/api/internal/site-access")
        || pathname.startsWith("/_next/")
        || pathname === "/favicon.ico"
        || /\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?)$/i.test(pathname)
    ) {
        return NextResponse.next();
    }

    if (!shouldRunSiteIpAllowlist(request)) {
        return NextResponse.next();
    }

    const policy = await loadPolicy(request.nextUrl.origin);

    if (!policy.restrictEnabled) {
        return NextResponse.next();
    }

    const ip = getClientIp(request);

    if (ip && policy.allowedIps.includes(ip)) {
        return NextResponse.next();
    }

    const url = new URL("/maintenance", request.url);

    return NextResponse.redirect(url, 307);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
