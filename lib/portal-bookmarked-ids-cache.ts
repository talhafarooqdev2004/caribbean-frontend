/**
 * Dedupes concurrent `/api/user/bookmarks` GETs (e.g. multiple Newsroom bookmark stars on one page).
 * Cleared after bookmark add/remove so the next check refetches.
 */

let inFlight: Promise<Set<string>> | null = null;
let cachedIds: Set<string> | null = null;
let cacheExpiresAt = 0;

const TTL_MS = 12_000;

export function clearPortalBookmarkedIdsCache(): void {
    cachedIds = null;
    cacheExpiresAt = 0;
    inFlight = null;
}

export async function getPortalBookmarkedReleaseIds(): Promise<Set<string>> {
    const now = Date.now();

    if (cachedIds && cacheExpiresAt > now) {
        return cachedIds;
    }

    if (inFlight) {
        return inFlight;
    }

    inFlight = (async () => {
        try {
            const response = await fetch("/api/user/bookmarks", {
                cache: "no-store",
                credentials: "include",
            });

            if (!response.ok) {
                return new Set<string>();
            }

            const data = (await response.json().catch(() => null)) as { bookmarks?: unknown } | null;
            const list = Array.isArray(data?.bookmarks) ? data.bookmarks : [];
            const ids = new Set<string>();

            for (const item of list) {
                if (item && typeof item === "object" && typeof (item as { id?: unknown }).id === "string") {
                    ids.add((item as { id: string }).id);
                }
            }

            cachedIds = ids;
            cacheExpiresAt = Date.now() + TTL_MS;

            return ids;
        } finally {
            inFlight = null;
        }
    })();

    return inFlight;
}
