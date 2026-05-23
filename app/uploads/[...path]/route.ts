import { getCaribBackendUrl } from "@/lib/backend-api";

export const runtime = "nodejs";

/** Proxy uploaded release assets from EC2 so cover images work on Amplify (HTTPS same-origin). */
export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    const segments = Array.isArray(path) ? path.filter(Boolean) : [];

    if (segments.length === 0) {
        return new Response(null, { status: 404 });
    }

    const assetPath = `/uploads/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
    const upstream = await fetch(`${getCaribBackendUrl()}${assetPath}`, { cache: "no-store" });

    if (!upstream.ok) {
        return new Response(null, { status: upstream.status });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");

    if (contentType) {
        headers.set("Content-Type", contentType);
    }

    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    return new Response(upstream.body, { status: 200, headers });
}
