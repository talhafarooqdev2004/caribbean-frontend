/** Shared newsroom list query helpers (safe for client and server). */

export const NEWSROOM_ALL_CATEGORIES_LABEL = "All Categories";

export const NEWSROOM_PAGE_SIZE = 10;

/** Default grid query; must match `listNewsroomDefaultGrid` on the server. */
export const NEWSROOM_DEFAULT_GRID_QUERY = `sort=newest&limit=${NEWSROOM_PAGE_SIZE}&page=1`;

export type NewsroomGridListFilters = {
    activeCategory: string;
    activeIsland: string;
    dateRange: string;
    sort: string;
    debouncedSearch: string;
    listPage: number;
};

export function buildNewsroomGridQueryString(filters: NewsroomGridListFilters): string {
    const params = new URLSearchParams();

    if (filters.activeCategory !== NEWSROOM_ALL_CATEGORIES_LABEL) {
        params.set("category", filters.activeCategory);
    }

    const islandFilterActive =
        filters.activeIsland !== "All Islands" && filters.activeIsland !== "All Caribbean";

    if (islandFilterActive) {
        params.set("island", filters.activeIsland);
    }

    if (filters.dateRange !== "allTime") {
        params.set("dateRange", filters.dateRange);
    }

    params.set("sort", filters.sort);

    if (filters.debouncedSearch) {
        params.set("search", filters.debouncedSearch);
    }

    params.set("limit", String(NEWSROOM_PAGE_SIZE));
    params.set("page", String(filters.listPage));

    return params.toString();
}
