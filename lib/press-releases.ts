import "server-only";

import { caribApiFetch, parseCaribApiJson } from "./backend-api";
import { NEWSROOM_DEFAULT_GRID_QUERY } from "./newsroom-press-release-query";
import { type PressReleaseRecord } from "./press-release-types";

export async function listApprovedPressReleases(limit = 100) {
    const response = await caribApiFetch(`/press-releases?sort=featured&limit=${limit}`);
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        throw new Error(typeof payload?.message === "string" ? payload.message : "Unable to load press releases.");
    }

    return (Array.isArray(payload?.data) ? payload.data : []) as PressReleaseRecord[];
}

/** Homepage “Latest from the Newsroom”: most recently published first. */
export async function listNewestApprovedPressReleases(limit = 1) {
    const response = await caribApiFetch(`/press-releases?sort=newest&limit=${limit}`);
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        throw new Error(typeof payload?.message === "string" ? payload.message : "Unable to load press releases.");
    }

    return (Array.isArray(payload?.data) ? payload.data : []) as PressReleaseRecord[];
}

/** Default newsroom grid (newest page 1); keep query in sync with `NEWSROOM_DEFAULT_GRID_QUERY`. */
export async function listNewsroomDefaultGrid(): Promise<{ releases: PressReleaseRecord[]; totalPages: number }> {
    const response = await caribApiFetch(`/press-releases?${NEWSROOM_DEFAULT_GRID_QUERY}`);
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        throw new Error(typeof payload?.message === "string" ? payload.message : "Unable to load press releases.");
    }

    const meta = payload?.meta && typeof payload.meta === "object" ? (payload.meta as Record<string, unknown>) : null;
    const totalPages = typeof meta?.totalPages === "number" ? Math.max(1, meta.totalPages) : 1;

    return {
        releases: (Array.isArray(payload?.data) ? payload.data : []) as PressReleaseRecord[],
        totalPages,
    };
}
