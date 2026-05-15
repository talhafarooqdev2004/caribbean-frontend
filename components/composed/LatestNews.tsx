"use client";

import styles from "./LatestNews.module.scss";

import { Container } from "../layout";
import { Button, News, SvgIcon } from "../ui";
import { useRouter } from "next/navigation";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import { trackPressReleaseClick } from "@/lib/press-release-click";
import {
  formatReleaseDate,
  getReleaseImageSrc,
  getReleaseUrl,
} from "@/lib/press-release-display";
import { releaseCardExcerpt, stripTagsToPlainText } from "@/lib/press-release-list-excerpt";

type LatestNewsProps = {
  releases?: PressReleaseRecord[];
};

export default function LatestNews({ releases = [] }: LatestNewsProps) {
  const router = useRouter();

  return (
    <section className={styles.latestNews}>
      <Container className={styles.latestNewsInner}>
        <div className={styles.latestNewsHeader}>
          <div>
            <h1 className={styles.heading}>Latest from the Newsroom</h1>
            <p className={styles.description}>
              Recent press releases making headlines
            </p>
          </div>

          <Button variant="secondary" className={styles.viewAllBtn} onClick={() => router.push("/newsroom")}>
            View All
            <SvgIcon icon="right-arrow-large" />
          </Button>
        </div>

        {releases.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Fresh stories on the way</h2>
            <p>
              Highlights from our newsroom will show up here as new Caribbean press releases are published. Visit the
              newsroom anytime for the full, live feed.
            </p>
          </div>
        ) : (
          <NewsList>
            {releases.map((release) => (
              <div
                key={release.id}
                className={styles.latestNewsCardHitArea}
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
                <News key={release.id}>
                  <News.Header>
                    <News.Image imgSrc={getReleaseImageSrc(release)} />
                    <News.Badge>{release.category || "News"}</News.Badge>
                  </News.Header>

                  <News.Body>
                    <News.Meta>
                      <News.Territory>{release.island || "Regional"}</News.Territory>
                      <News.Seprator />
                      <News.Date>{formatReleaseDate(release.publishedAt || release.createdAt)}</News.Date>
                    </News.Meta>

                    <News.Title>{stripTagsToPlainText(release.title)}</News.Title>

                    <News.Description>{releaseCardExcerpt(release)}</News.Description>

                    <News.ReadLink link={getReleaseUrl(release)} releaseId={release.id} />
                  </News.Body>
                </News>
              </div>
            ))}
          </NewsList>
        )}
      </Container>
    </section>
  );
}

function NewsList({ children }: React.PropsWithChildren) {
  return <div className={styles.newsList}>{children}</div>;
}
