import "server-only";

export function getCaribBackendUrl() {
    return (
        process.env.CARIB_BACKEND_URL ||
        process.env.NEXT_PUBLIC_CARIB_BACKEND_URL ||
        "http://localhost:5000"
    ).replace(/\/$/, "");
}

export async function caribApiFetch(path: string, init: RequestInit = {}) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return fetch(`${getCaribBackendUrl()}/api/v1${normalizedPath}`, {
        ...init,
        cache: "no-store",
        headers: {
            ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...init.headers,
        },
    });
}

/**
 * GET /press-releases list (newsroom). Next.js Data Cache + backend Redis: identical query strings
 * avoid a second hop to Express within `revalidate` seconds; Redis still caches Mongo on the API.
 */
export async function caribApiFetchPublicPressReleaseList(queryString: string) {
    const q = queryString.trim();
    const path = q ? `/press-releases?${q}` : "/press-releases";
    const url = `${getCaribBackendUrl()}/api/v1${path}`;

    return fetch(url, {
        headers: { Accept: "application/json" },
        cache: "force-cache",
        next: { revalidate: 180, tags: ["press-releases-public-list"] },
    });
}

export async function parseCaribApiJson(response: Response) {
    return response.json().catch(() => null) as Promise<Record<string, unknown> | null>;
}

export function getCaribApiMessage(payload: Record<string, unknown> | null, fallback: string) {
    return typeof payload?.message === "string" ? payload.message : fallback;
}
