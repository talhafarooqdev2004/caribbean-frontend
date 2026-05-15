"use client";

import styles from "./RecentReleases.module.scss";

import { Container } from "../layout";
import { memo, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { News } from "../ui";
import NewsroomBookmarkButton from "@/components/newsroom/NewsroomBookmarkButton";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import { trackPressReleaseClick } from "@/lib/press-release-click";
import {
    formatReleaseDate,
    formatReleaseTime,
    getReleaseImageSrc,
    getReleaseUrl,
} from "@/lib/press-release-display";
import { releaseCardExcerpt, stripTagsToPlainText } from "@/lib/press-release-list-excerpt";

type RecentReleasesSectionProps = {
    releases?: PressReleaseRecord[];
};

const RecentReleaseGridCard = memo(function RecentReleaseGridCard({ release }: { release: PressReleaseRecord }) {
    const router = useRouter();

    return (
        <div
            className={styles.releaseCardHitArea}
            role="link"
            tabIndex={0}
            onClick={() => {
                trackPressReleaseClick(release.id);
                router.push(getReleaseUrl(release));
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    trackPressReleaseClick(release.id);
                    router.push(getReleaseUrl(release));
                }
            }}
        >
            <NewsroomBookmarkButton releaseId={release.id} />
            <News variant="recent-releases">
                <News.Header>
                    <News.Image imgSrc={getReleaseImageSrc(release)} />
                </News.Header>

                <News.Body>
                    <News.Meta>
                        <News.Territory>{release.island || "Regional"}</News.Territory>
                        <News.Seprator type="line-seprator" />
                        <News.Date>{formatReleaseDate(release.publishedAt || release.createdAt)}</News.Date>
                        <News.Seprator />
                        <News.Time>{formatReleaseTime(release.publishedAt || release.createdAt)}</News.Time>
                    </News.Meta>

                    <News.Title>{stripTagsToPlainText(release.title)}</News.Title>
                    <News.Description>{releaseCardExcerpt(release)}</News.Description>

                    <News.TagsList>
                        <News.Tag>{release.category}</News.Tag>
                        {release.featured ? <News.Tag>Featured</News.Tag> : null}
                    </News.TagsList>

                    <News.ReadLink link={getReleaseUrl(release)} releaseId={release.id} />
                </News.Body>
            </News>
        </div>
    );
});

export default function RecentReleasesSection({ releases = [] }: RecentReleasesSectionProps) {
    return (
        <section className={styles.recentReleases}>
            <Container className={styles.recentReleasesInner}>
                <h2>Recent Releases</h2>

                {releases.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3>More stories coming soon</h3>
                        <p>
                            Newly published press releases from across the Caribbean will appear in this section. Visit the
                            newsroom to read the full collection of live coverage today.
                        </p>
                    </div>
                ) : (
                    <RecentReleases>
                        {releases.map((release) => (
                            <RecentReleaseGridCard key={release.id} release={release} />
                        ))}
                    </RecentReleases>
                )}
            </Container>
        </section>
    );
}

function RecentReleases({ children }: PropsWithChildren) {
    return <div className={styles.recentReleasesList}>{children}</div>;
}
