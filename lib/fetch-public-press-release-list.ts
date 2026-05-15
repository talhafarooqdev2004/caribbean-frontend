import { type PressReleaseRecord } from "./press-release-types";

function getPublicBackendBase(): string {
    const raw = process.env.NEXT_PUBLIC_CARIB_BACKEND_URL?.trim();

    if (!raw) {
        throw new Error("NEXT_PUBLIC_CARIB_BACKEND_URL is required for newsroom list requests");
    }

    return raw.replace(/\/$/, "");
}

/**
 * Public press list: browser → Express (one hop). Avoids Next `/api/press-releases` proxy latency.
 * Uses a simple GET with no custom headers so the request stays CORS-simple (no preflight).
 */
export async function fetchPublicPressReleaseListClient(
    queryString: string,
    init?: RequestInit,
): Promise<{ releases: PressReleaseRecord[]; totalPages: number }> {
    const path = queryString.length > 0 ? `/api/v1/press-releases?${queryString}` : "/api/v1/press-releases";
    const url = `${getPublicBackendBase()}${path}`;

    const response = await fetch(url, {
        ...init,
        credentials: "omit",
        cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    if (!response.ok || !payload) {
        return { releases: [], totalPages: 1 };
    }

    const meta = payload.meta && typeof payload.meta === "object" ? (payload.meta as Record<string, unknown>) : null;
    const totalPages = typeof meta?.totalPages === "number" ? Math.max(1, meta.totalPages) : 1;
    const releases = (Array.isArray(payload.data) ? payload.data : []) as PressReleaseRecord[];

    return { releases, totalPages };
}
