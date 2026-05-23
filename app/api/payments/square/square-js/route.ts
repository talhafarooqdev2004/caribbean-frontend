import { type NextRequest } from "next/server";

export const runtime = "nodejs";

const UPSTREAM: Record<"sandbox" | "production", string> = {
    sandbox: "https://sandbox.web.squarecdn.com/v1/square.js",
    production: "https://web.squarecdn.com/v1/square.js",
};

/**
 * Serves Square Web Payments `square.js` from this origin so the browser does not
 * call Square CDN directly (avoids 403 when Square blocks unknown Referer / domain).
 */
export async function GET(request: NextRequest) {
    const envParam = request.nextUrl.searchParams.get("env");
    const env: "sandbox" | "production" = envParam === "production" ? "production" : "sandbox";
    const upstream = UPSTREAM[env];

    let upstreamRes: Response;
    try {
        upstreamRes = await fetch(upstream, {
            next: { revalidate: 3600 },
            headers: {
                Accept: "application/javascript,*/*;q=0.1",
            },
        });
    } catch {
        return new Response("/* Square SDK upstream fetch failed */", {
            status: 502,
            headers: { "Content-Type": "application/javascript; charset=utf-8" },
        });
    }

    const body = await upstreamRes.text();

    if (!upstreamRes.ok) {
        return new Response(`/* Square SDK upstream HTTP ${upstreamRes.status} */`, {
            status: upstreamRes.status,
            headers: { "Content-Type": "application/javascript; charset=utf-8" },
        });
    }

    return new Response(body, {
        status: 200,
        headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
