"use client";

import styles from "./FeaturedPressReleases.module.scss";

import { Container } from "../layout";
import {
    Button,
    News,
    SvgIcon
} from "../ui";
import NewsroomBookmarkButton from "@/components/newsroom/NewsroomBookmarkButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import { trackPressReleaseClick } from "@/lib/press-release-click";
import {
    formatReleaseDate,
    getReleaseImageSrc,
    getReleaseUrl,
} from "@/lib/press-release-display";
import { releaseCardExcerpt, stripTagsToPlainText } from "@/lib/press-release-list-excerpt";

type FeaturedPressReleasesProps = {
    releases?: PressReleaseRecord[];
};

export default function FeaturedPressReleases({ releases = [] }: FeaturedPressReleasesProps) {
    const router = useRouter();
    const featuredReleases = releases.filter((release) => release.featured);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideEnter, setSlideEnter] = useState<"fromLeft" | "fromRight" | null>(null);
    const [hasCarouselNavigated, setHasCarouselNavigated] = useState(false);
    const maxFeaturedIndex = Math.max(featuredReleases.length - 1, 0);
    const activeIndexClamped = Math.min(activeIndex, maxFeaturedIndex);
    const activeRelease = featuredReleases[activeIndexClamped] ?? featuredReleases[0] ?? null;

    useEffect(() => {
        setActiveIndex((current) => Math.min(current, maxFeaturedIndex));
    }, [maxFeaturedIndex]);

    function showPreviousRelease() {
        setHasCarouselNavigated(true);
        setSlideEnter("fromLeft");
        setActiveIndex((current) => current === 0 ? Math.max(featuredReleases.length - 1, 0) : current - 1);
    }

    function showNextRelease() {
        setHasCarouselNavigated(true);
        setSlideEnter("fromRight");
        setActiveIndex((current) => featuredReleases.length === 0 ? 0 : (current + 1) % featuredReleases.length);
    }

    if (!activeRelease) {
        return null;
    }

    return (
        <section className={styles.featuredPressReleases}>
            <Container className={styles.featuredPressReleasesInner}>
                <div className={styles.featuredHeader}>
                    <h3>Featured</h3>

                    <div className={styles.featuredAction}>
                        <Button
                            variant="slider"
                            size={undefined}
                            type="button"
                            onClick={showPreviousRelease}
                            disabled={featuredReleases.length <= 1}
                            aria-label="Show previous featured release"
                        >
                            <SvgIcon icon="left-arrow" />
                        </Button>
                        <Button
                            variant="slider"
                            size={undefined}
                            type="button"
                            onClick={showNextRelease}
                            disabled={featuredReleases.length <= 1}
                            aria-label="Show next featured release"
                        >
                            <SvgIcon icon="right-arrow" />
                        </Button>
                    </div>
                </div>

                <div className={styles.featuredReleases}>
                    <div
                        className={styles.featuredReleaseHitArea}
                        role="link"
                        tabIndex={0}
                        onClick={() => {
                            trackPressReleaseClick(activeRelease.id);
                            router.push(getReleaseUrl(activeRelease));
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                trackPressReleaseClick(activeRelease.id);
                                router.push(getReleaseUrl(activeRelease));
                            }
                        }}
                    >
                        <NewsroomBookmarkButton releaseId={activeRelease.id} />
                        <div
                            key={activeIndexClamped}
                            className={[
                                styles.featuredReleaseSlide,
                                hasCarouselNavigated && slideEnter === "fromRight" ? styles.featuredEnterFromRight : "",
                                hasCarouselNavigated && slideEnter === "fromLeft" ? styles.featuredEnterFromLeft : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            <News variant="featured" key={activeRelease.id}>
                            <News.Header>
                                <News.Image imgSrc={getReleaseImageSrc(activeRelease)} />
                                <News.Badge>FEATURED</News.Badge>
                            </News.Header>

                            <News.Body>
                                <News.Meta>
                                    <News.Territory>{activeRelease.island || "Regional"}</News.Territory>
                                    <News.Seprator />
                                    <News.Date>{formatReleaseDate(activeRelease.publishedAt || activeRelease.createdAt)}</News.Date>
                                </News.Meta>

                                <News.Title>{stripTagsToPlainText(activeRelease.title)}</News.Title>

                                <News.Description>{releaseCardExcerpt(activeRelease)}</News.Description>

                                <News.ReadLink link={getReleaseUrl(activeRelease)} releaseId={activeRelease.id} />
                            </News.Body>
                        </News>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
