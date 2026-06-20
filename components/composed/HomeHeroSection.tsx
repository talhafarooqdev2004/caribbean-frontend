"use client";

import styles from "./HeroSection.module.scss";

import { useMemo, useState } from "react";
import { ArrowRight, Clock, Search, Shield, Users } from "lucide-react";
import { Container } from "../layout";
import { Button } from "../ui";
import { useRouter } from "next/navigation";
import { pushSubmitPressRelease } from "@/lib/push-submit-press-release";
import { buildNewsroomSearchUrl } from "@/lib/newsroom-press-release-query";
import { formatReleaseDate, getReleaseUrl } from "@/lib/press-release-display";
import { stripTagsToPlainText } from "@/lib/press-release-list-excerpt";
import { trackPressReleaseClick } from "@/lib/press-release-click";
import { getPressReleaseCategorySlug } from "@/lib/press-release-category";
import { type PressReleaseRecord } from "@/lib/press-release-types";

type PreviewReleaseItem = {
    key: string;
    categorySlug: string;
    category: string;
    title: string;
    note: string;
    href?: string;
    releaseId?: string;
};

const fallbackPreviewReleases: PreviewReleaseItem[] = [
    { key: "fallback-business", categorySlug: "business", category: "Business", title: "Your business news, delivered to 500+ Caribbean media contacts", note: "Submit your first release" },
    { key: "fallback-culture", categorySlug: "culture", category: "Culture", title: "Reach journalists across 15+ Caribbean islands in 48 hours", note: "Ready for submissions" },
    { key: "fallback-tech", categorySlug: "technology", category: "Tech", title: "Editorial review included — we verify every release we distribute", note: "Just launched · Be first" },
];

function formatHeroCategoryLabel(category: string) {
    const trimmed = category.trim();

    if (/^technology$/i.test(trimmed)) {
        return "Tech";
    }

    return trimmed;
}

function mapReleaseToPreviewItem(release: PressReleaseRecord): PreviewReleaseItem {
    const publishedAt = release.publishedAt || release.createdAt;
    const territory = release.island?.trim() || release.targetRegions?.trim() || "Regional";

    return {
        key: release.id,
        categorySlug: getPressReleaseCategorySlug(release.category),
        category: formatHeroCategoryLabel(release.category || "News"),
        title: stripTagsToPlainText(release.title),
        note: `${territory} · ${formatReleaseDate(publishedAt)}`,
        href: getReleaseUrl(release),
        releaseId: release.id,
    };
}

type HomeHeroSectionProps = {
    latestReleases?: PressReleaseRecord[];
};

export default function HomeHeroSection({ latestReleases = [] }: HomeHeroSectionProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const previewReleases = useMemo(() => {
        const liveItems = latestReleases.slice(0, 3).map(mapReleaseToPreviewItem);

        return liveItems.length > 0 ? liveItems : fallbackPreviewReleases;
    }, [latestReleases]);

    function handleSearch(event: React.FormEvent) {
        event.preventDefault();
        router.push(buildNewsroomSearchUrl(search));
    }

    function openPreviewRelease(item: PreviewReleaseItem) {
        if (!item.href) {
            return;
        }

        if (item.releaseId) {
            trackPressReleaseClick(item.releaseId);
        }

        router.push(item.href);
    }

    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <div className={styles.detailSection}>
                    <span className={styles.heroSectionBadge}>Premium Caribbean Press Distribution</span>

                    <h1 className={styles.heroSectionHeading}>
                        Press Distribution
                        <span className={styles.prominentText}>for the Caribbean.</span>
                    </h1>

                    <p className={styles.heroSectionDescription}>
                        Distribute announcements, campaigns, and news directly to journalists, editors, and
                        media outlets across the region and diaspora.
                    </p>

                    <form className={styles.searchBar} onSubmit={handleSearch}>
                        <span className={styles.searchIcon}>
                            <Search size={18} strokeWidth={2} />
                        </span>
                        <input
                            type="search"
                            placeholder="Search press releases, topics..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search press releases"
                        />
                        <Button type="submit" className={styles.searchButton}>Search</Button>
                    </form>

                    <div className={styles.ctaBtns}>
                        <Button variant="form" className={styles.submitReleaseBtn} onClick={() => pushSubmitPressRelease(router)}>
                            Submit Your Press Release
                            <ArrowRight size={18} strokeWidth={2} />
                        </Button>
                        <Button variant="join-as-media" onClick={() => router.push("/join-the-media-network")}>Join as Media</Button>
                    </div>
                </div>

                <div className={styles.previewColumn}>
                    <div className={styles.palmDecor} aria-hidden="true">
                        <svg width="282" height="414" viewBox="0 0 282 414" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M140.949 401.498V121.499" stroke="currentColor" strokeWidth="17.9999" strokeLinecap="round" />
                            <path d="M140.949 181.5C120.949 141.5 60.9492 101.5 0.949219 81.4995C40.9492 91.4995 100.949 121.5 140.949 161.5" stroke="currentColor" strokeWidth="5.99996" strokeLinecap="round" />
                            <path d="M140.949 161.5C160.949 121.5 220.949 81.4998 280.949 61.4998C240.949 76.4998 180.949 106.5 140.949 146.5" stroke="currentColor" strokeWidth="5.99996" strokeLinecap="round" />
                            <path d="M140.949 141.5C140.949 101.5 160.949 41.5 190.949 1.5C175.949 36.5 155.949 86.5 140.949 131.5" stroke="currentColor" strokeWidth="4.99997" strokeLinecap="round" />
                            <path d="M140.949 151.5C105.949 121.5 70.9492 81.5 50.9492 21.5C70.9492 66.5 105.949 116.5 140.949 141.5" stroke="currentColor" strokeWidth="4.99997" strokeLinecap="round" />
                            <path opacity="0.4" d="M140.949 413.498C174.086 413.498 200.949 409.02 200.949 403.498C200.949 397.975 174.086 393.498 140.949 393.498C107.812 393.498 80.9492 397.975 80.9492 403.498C80.9492 409.02 107.812 413.498 140.949 413.498Z" fill="currentColor" />
                        </svg>
                    </div>

                    <div className={styles.previewCard}>
                        <div className={styles.previewHeader}>
                            <span className={styles.previewEyebrow}>Latest Releases</span>
                            <span className={styles.previewLive}>Live Newsroom</span>
                        </div>

                        <ul className={styles.previewList}>
                            {previewReleases.map((item) => (
                                <li key={item.key} className={styles.previewItem}>
                                    {item.href ? (
                                        <button
                                            type="button"
                                            className={styles.previewItemButton}
                                            onClick={() => openPreviewRelease(item)}
                                        >
                                            <span className={styles.previewCategory} data-category={item.categorySlug}>{item.category}</span>
                                            <div className={styles.previewBody}>
                                                <p className={styles.previewTitle}>{item.title}</p>
                                                <span className={styles.previewNote}>{item.note}</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <>
                                            <span className={styles.previewCategory} data-category={item.categorySlug}>{item.category}</span>
                                            <div className={styles.previewBody}>
                                                <p className={styles.previewTitle}>{item.title}</p>
                                                <span className={styles.previewNote}>{item.note}</span>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className={styles.previewFooter}>
                            <span><Shield size={14} strokeWidth={1.75} color="#5899E2" /> Editorial Review</span>
                            <span><Clock size={14} strokeWidth={1.75} color="#5899E2" /> 48hr Turnaround</span>
                            <span><Users size={14} strokeWidth={1.75} color="#5899E2" /> 500+ Media</span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
