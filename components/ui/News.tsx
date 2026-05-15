"use client";

import styles from "./News.module.scss";

import Image from "next/image";
import SvgIcon from "./SvgIcon";
import clsx from "clsx";
import Link from "next/link";
import { trackPressReleaseClick } from "@/lib/press-release-click";

const News = function ({
    variant = "default",
    children,
}: React.PropsWithChildren<{ variant?: "default" | "featured" | "recent-releases" | "portal-bookmark" }>) {
    const variants = {
        default: "",
        featured: styles.featured,
        "recent-releases": styles.recentReleases,
        "portal-bookmark": styles.portalBookmark,
    };

    return <div className={clsx(styles.news, variants[variant])}>{children}</div>;
};

News.Header = function NewsHeader({ children }: React.PropsWithChildren) {
    return <header className={styles.newsHeader}>{children}</header>;
};

News.Image = function NewsImage({ imgSrc }: { imgSrc: string }) {
    const isRemote = /^https?:\/\//i.test(imgSrc);
    const isBlob = /^blob:/i.test(imgSrc);

    return (
        <Image
            src={imgSrc}
            alt="Latest News Image"
            fill
            className={styles.newsImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
            unoptimized={isRemote || isBlob}
        />
    );
};

News.Badge = function NewsBadge({ children }: React.PropsWithChildren) {
    return <span className={styles.newsBadge}>{children}</span>;
};

News.Body = function NewsBody({ children }: React.PropsWithChildren) {
    return <div className={styles.newsBody}>{children}</div>;
};

News.Meta = function NewsMeta({ children }: React.PropsWithChildren) {
    return <div className={styles.newsMeta}>{children}</div>;
};

News.Territory = function NewsTerritory({ children }: React.PropsWithChildren) {
    return <span className={styles.newsTerritory}>{children}</span>;
};

News.Seprator = function NewsMetaSeprator({ type = "dot-seprator" }: { type?: "dot-seprator" | "line-seprator" }) {
    return <SvgIcon icon={type} />
};

News.Date = function NewsDate({ children }: React.PropsWithChildren) {
    return <span className={styles.newsDate}>{children}</span>;
};

News.Time = function NewsTime({ children }: React.PropsWithChildren) {
    return <span className={styles.newsTime}>{children}</span>
};

News.Title = function NewsTitle({ children }: React.PropsWithChildren) {
    return <h2 className={styles.newsTitle}>{children}</h2>;
};

News.Description = function NewsDescription({ children }: React.PropsWithChildren) {
    return <p className={styles.newsDescription}>{children}</p>;
};

News.TagsList = function NewsTagsList({ children }: React.PropsWithChildren) {
    return <div className={styles.newsTagsList}>{children}</div>;
};

News.Tag = function NewsTag({ children }: React.PropsWithChildren) {
    return <span className={styles.newsTag}>{children}</span>;
};

News.ReadLink = function NewsReadLink({ link, releaseId, trackClicks = true }: { link: string; releaseId?: string; trackClicks?: boolean }) {
    function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
        // Nested inside card hit-areas that use onClick + router.push; Link clicks must not bubble or we skip parent tracking and can double-navigate.
        event.stopPropagation();
        if (trackClicks && releaseId) {
            trackPressReleaseClick(releaseId);
        }
    }

    return (
        <Link className={styles.newsReadLink} href={link} onClick={handleClick}>
            Read Full Release
            <SvgIcon icon="right-arrow-large" />
        </Link>
    );
};

export default News;