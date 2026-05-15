"use client";

import styles from "./NewsRoomCLientPage.module.scss";

import {
    FeaturedPressReleases,
    NewsRoomHeroSection,
    RecentReleasesSection,
    WantToBeFeaturedHere,
} from "@/components/composed";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { fetchPublicPressReleaseListClient } from "@/lib/fetch-public-press-release-list";
import {
    buildNewsroomGridQueryString,
    NEWSROOM_ALL_CATEGORIES_LABEL,
    NEWSROOM_DEFAULT_GRID_QUERY,
} from "@/lib/newsroom-press-release-query";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import { useEffect, useMemo, useRef, useState, startTransition } from "react";

function mergeReleasesById(a: PressReleaseRecord[], b: PressReleaseRecord[]) {
    const map = new Map<string, PressReleaseRecord>();

    for (const release of a) {
        map.set(release.id, release);
    }

    for (const release of b) {
        map.set(release.id, release);
    }

    return Array.from(map.values());
}

function appendReleasesDeduped(prev: PressReleaseRecord[], nextPage: PressReleaseRecord[]) {
    if (nextPage.length === 0) {
        return prev;
    }

    const seen = new Set(prev.map((r) => r.id));
    const extra = nextPage.filter((r) => !seen.has(r.id));
    return extra.length === 0 ? prev : [...prev, ...extra];
}

type NewsRoomClientPageProps = {
    initialFeaturedReleases?: PressReleaseRecord[];
    initialGridReleases?: PressReleaseRecord[];
    initialTotalPages?: number;
};

export default function NewsRoomCLientPage({
    initialFeaturedReleases = [],
    initialGridReleases = [],
    initialTotalPages = 1,
}: NewsRoomClientPageProps) {
    const [releases, setReleases] = useState(initialGridReleases);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [listPage, setListPage] = useState(1);
    const [listLoading, setListLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState(NEWSROOM_ALL_CATEGORIES_LABEL);
    const [activeIsland, setActiveIsland] = useState("All Islands");
    const [dateRange, setDateRange] = useState("allTime");
    const [sort, setSort] = useState("newest");
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const ssrPrimedDefaultGridRef = useRef(initialGridReleases.length > 0);
    const hydrationDoneRef = useRef(false);
    const userMutatedFiltersRef = useRef(false);
    const listRequestIdRef = useRef(0);
    const searchDebounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (searchDebounceTimerRef.current != null) {
            window.clearTimeout(searchDebounceTimerRef.current);
        }
        searchDebounceTimerRef.current = window.setTimeout(() => {
            searchDebounceTimerRef.current = null;
            setDebouncedSearch(searchValue.trim());
            setListPage(1);
        }, 350);

        return () => {
            if (searchDebounceTimerRef.current != null) {
                window.clearTimeout(searchDebounceTimerRef.current);
                searchDebounceTimerRef.current = null;
            }
        };
    }, [searchValue]);

    function flushPendingSearchToDebounced() {
        if (searchDebounceTimerRef.current != null) {
            window.clearTimeout(searchDebounceTimerRef.current);
            searchDebounceTimerRef.current = null;
        }
        setDebouncedSearch(searchValue.trim());
    }

    useEffect(() => {
        const qs = buildNewsroomGridQueryString({
            activeCategory,
            activeIsland,
            dateRange,
            sort,
            debouncedSearch,
            listPage,
        });

        const controller = new AbortController();

        if (qs !== NEWSROOM_DEFAULT_GRID_QUERY) {
            userMutatedFiltersRef.current = true;
        }

        if (
            qs === NEWSROOM_DEFAULT_GRID_QUERY &&
            ssrPrimedDefaultGridRef.current &&
            !hydrationDoneRef.current
        ) {
            hydrationDoneRef.current = true;
            return () => controller.abort();
        }

        if (
            qs === NEWSROOM_DEFAULT_GRID_QUERY &&
            ssrPrimedDefaultGridRef.current &&
            !userMutatedFiltersRef.current
        ) {
            return () => controller.abort();
        }

        let cancelled = false;
        const requestId = ++listRequestIdRef.current;
        const requestedPage = listPage;

        setListLoading(true);

        fetchPublicPressReleaseListClient(qs, { signal: controller.signal })
            .then((result) => {
                if (cancelled || requestId !== listRequestIdRef.current) {
                    return;
                }

                setTotalPages(result.totalPages);

                if (requestedPage <= 1) {
                    setReleases(result.releases);
                } else {
                    startTransition(() => {
                        setReleases((prev) => appendReleasesDeduped(prev, result.releases));
                    });
                }
            })
            .catch(() => null)
            .finally(() => {
                if (!cancelled && requestId === listRequestIdRef.current) {
                    setListLoading(false);
                }
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [activeCategory, activeIsland, dateRange, sort, debouncedSearch, listPage]);

    const releasesForFeaturedCarousel = useMemo(() => {
        const featuredFromGrid = releases.filter((r) => r.featured);
        const gridQs = buildNewsroomGridQueryString({
            activeCategory,
            activeIsland,
            dateRange,
            sort,
            debouncedSearch,
            listPage,
        });

        if (gridQs !== NEWSROOM_DEFAULT_GRID_QUERY) {
            return featuredFromGrid;
        }
        return mergeReleasesById(initialFeaturedReleases, featuredFromGrid);
    }, [
        initialFeaturedReleases,
        releases,
        activeCategory,
        activeIsland,
        dateRange,
        sort,
        debouncedSearch,
        listPage,
    ]);

    function updateCategory(category: string) {
        flushPendingSearchToDebounced();
        setActiveCategory(category);
        setListPage(1);
    }

    function updateSearch(value: string) {
        setSearchValue(value);
    }

    const showLoadMore = listPage < totalPages;
    const isAppendingMore = listLoading && listPage > 1;

    return (
        <>
            <NewsRoomHeroSection
                activeCategory={activeCategory}
                activeIsland={activeIsland}
                dateRange={dateRange}
                searchValue={searchValue}
                sort={sort}
                onCategoryChange={updateCategory}
                onDateRangeChange={(value) => {
                    flushPendingSearchToDebounced();
                    setDateRange(value);
                    setListPage(1);
                }}
                onIslandChange={(value) => {
                    flushPendingSearchToDebounced();
                    setActiveIsland(value);
                    setListPage(1);
                }}
                onSearchChange={updateSearch}
                onSortChange={(value) => {
                    flushPendingSearchToDebounced();
                    setSort(value);
                    setListPage(1);
                }}
            />
            <FeaturedPressReleases releases={releasesForFeaturedCarousel} />
            <RecentReleasesSection releases={releases} />
            <Container className={styles.newsroomLoadMoreStrip}>
                {showLoadMore ? (
                    <div className={styles.loadMoreReleases}>
                        {isAppendingMore ? (
                            <div className={styles.loadMoreLoadingRow} role="status" aria-live="polite">
                                <span className={styles.loadMoreSpinner} aria-hidden />
                                <span className={styles.loadMoreLoadingLabel}>Loading more releases…</span>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="outline-black"
                                size="md"
                                disabled={listLoading}
                                aria-busy={listLoading}
                                onClick={() => setListPage((page) => Math.min(totalPages, page + 1))}
                            >
                                Load more
                            </Button>
                        )}
                    </div>
                ) : null}
            </Container>
            <WantToBeFeaturedHere />
        </>
    );
}
