"use client";

import styles from "./NewsRoomCLientPage.module.scss";

import {
    FeaturedPressReleases,
    NewsRoomHeroSection,
    RecentReleasesSection,
    WantToBeFeaturedHere,
} from "@/components/composed";
import { Container } from "@/components/layout";
import { SvgIcon } from "@/components/ui";
import { fetchPublicPressReleaseListClient } from "@/lib/fetch-public-press-release-list";
import {
    buildNewsroomGridQueryString,
    NEWSROOM_ALL_CATEGORIES_LABEL,
    NEWSROOM_DEFAULT_GRID_QUERY,
} from "@/lib/newsroom-press-release-query";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialUrlSearch = searchParams.get("search")?.trim() ?? "";

    const [releases, setReleases] = useState(initialGridReleases);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [listPage, setListPage] = useState(1);
    const [listLoading, setListLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState(NEWSROOM_ALL_CATEGORIES_LABEL);
    const [appliedSearch, setAppliedSearch] = useState(initialUrlSearch);
    const [searchValue, setSearchValue] = useState(initialUrlSearch);

    const ssrPrimedDefaultGridRef = useRef(initialGridReleases.length > 0);
    const hydrationDoneRef = useRef(false);
    const userMutatedFiltersRef = useRef(false);
    const listRequestIdRef = useRef(0);

    function applyFilters() {
        const trimmed = searchValue.trim();
        setAppliedSearch(trimmed);
        setListPage(1);

        const params = new URLSearchParams(searchParams.toString());

        if (trimmed) {
            params.set("search", trimmed);
        } else {
            params.delete("search");
        }

        const qs = params.toString();
        router.replace(qs ? `/newsroom?${qs}` : "/newsroom", { scroll: false });
    }

    useEffect(() => {
        const q = searchParams.get("search")?.trim() ?? "";
        setSearchValue(q);
        setAppliedSearch(q);
        setListPage(1);
    }, [searchParams]);

    useEffect(() => {
        const qs = buildNewsroomGridQueryString({
            activeCategory,
            activeIsland: "All Islands",
            dateRange: "allTime",
            sort: "newest",
            debouncedSearch: appliedSearch,
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
    }, [activeCategory, appliedSearch, listPage]);

    const releasesForFeaturedCarousel = useMemo(() => {
        const featuredFromGrid = releases.filter((r) => r.featured);
        const gridQs = buildNewsroomGridQueryString({
            activeCategory,
            activeIsland: "All Islands",
            dateRange: "allTime",
            sort: "newest",
            debouncedSearch: appliedSearch,
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
        appliedSearch,
        listPage,
    ]);

    function updateCategory(category: string) {
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
                searchValue={searchValue}
                onCategoryChange={updateCategory}
                onSearchChange={updateSearch}
                onFilterApply={applyFilters}
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
                            <button
                                type="button"
                                className={styles.loadMoreButton}
                                disabled={listLoading}
                                aria-busy={listLoading}
                                onClick={() => setListPage((page) => Math.min(totalPages, page + 1))}
                            >
                                <SvgIcon icon="down-arrow" />
                                Load More Releases
                            </button>
                        )}
                    </div>
                ) : null}
            </Container>
            <WantToBeFeaturedHere />
        </>
    );
}
