"use client";

import styles from "./LatestNews.module.scss";

import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { clsx } from "clsx";
import { Container } from "../layout";
import { News } from "../ui";
import { useRouter } from "next/navigation";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import { trackPressReleaseClick } from "@/lib/press-release-click";
import {
  formatReleaseDate,
  getReleaseImageSrc,
  getReleaseUrl,
} from "@/lib/press-release-display";
import { releaseCardExcerpt, stripTagsToPlainText } from "@/lib/press-release-list-excerpt";
import { getPressReleaseReadingMinutes } from "@/lib/press-release-reading-time";

type LatestNewsProps = {
  releases?: PressReleaseRecord[];
};

const filters = ["All", "Business", "Technology", "Culture", "Environment"];

function getInitials(value: string) {
  const parts = (value || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CN";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function LatestNews({ releases = [] }: LatestNewsProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleReleases = activeFilter === "All"
    ? releases
    : releases.filter((release) => (release.category || "").toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className={styles.latestNews}>
      <Container className={styles.latestNewsInner}>
        <div className={styles.latestNewsHeader}>
          <div>
            <span className={styles.eyebrow}>Latest from the newsroom</span>
            <h2 className={styles.heading}>Recent press releases making headlines</h2>
          </div>

          <button type="button" className={styles.viewAll} onClick={() => router.push("/newsroom")}>
            View All
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={clsx(styles.filter, filter === activeFilter && styles.filterActive)}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {visibleReleases.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Fresh stories on the way</h2>
            <p>
              Highlights from our newsroom will show up here as new Caribbean press releases are
              published. Visit the newsroom anytime for the full, live feed.
            </p>
          </div>
        ) : (
          <NewsList>
            {visibleReleases.map((release) => (
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
                    <News.Category>{release.category || "News"}</News.Category>
                    <News.ReadTime>
                      <Clock size={12} strokeWidth={2} />
                      {getPressReleaseReadingMinutes(release)} min read
                    </News.ReadTime>
                  </News.Header>

                  <News.Body>
                    <News.Meta>
                      <News.Territory>{release.island || "Regional"}</News.Territory>
                      <News.Date>{formatReleaseDate(release.publishedAt || release.createdAt)}</News.Date>
                    </News.Meta>

                    <News.Title>{stripTagsToPlainText(release.title)}</News.Title>

                    <News.Description>{releaseCardExcerpt(release)}</News.Description>

                    <News.Footer>
                      <News.Author initials={getInitials(release.organization)} name={release.organization || "Carib Newswire"} />
                      <News.ReadLink link={getReleaseUrl(release)} releaseId={release.id} />
                    </News.Footer>
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
