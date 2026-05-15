import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "./NewsroomReleasePage.module.scss";

import { ReleaseArticleBody } from "@/components/newsroom/ReleaseArticleBody";
import { Container } from "@/components/layout";
import { SvgIcon } from "@/components/ui";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import {
    formatReleaseDate,
    formatReleaseTime,
    getReleaseImageSrc,
} from "@/lib/press-release-display";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import { releaseHeroLead, stripTagsToPlainText } from "@/lib/press-release-list-excerpt";
import { safeOutboundLinkHref } from "@/lib/safe-outbound-url";

type NewsroomReleasePageProps = {
    params: Promise<{
        slug: string;
    }>;
};

async function getPressRelease(slug: string) {
    const response = await caribApiFetch(`/press-releases/${encodeURIComponent(slug)}`);
    const payload = await parseCaribApiJson(response);

    if (!response.ok || !payload?.data) {
        return null;
    }

    const release = payload.data as PressReleaseRecord;

    return release.status === "approved" ? release : null;
}

export default async function NewsroomReleasePage({ params }: NewsroomReleasePageProps) {
    const { slug } = await params;
    const release = await getPressRelease(slug);

    if (!release) {
        notFound();
    }

    void caribApiFetch(`/press-releases/${encodeURIComponent(slug)}/views`, {
        method: "POST",
    }).catch(() => null);

    const dateValue = release.publishedAt || release.createdAt;
    const heroLead = releaseHeroLead(release);
    const heroImageSrc = getReleaseImageSrc(release);
    const heroImageRemote = /^https?:\/\//i.test(heroImageSrc);
    const outboundHref = safeOutboundLinkHref(release.outboundLink);

    return (
        <main className={styles.releasePage}>
            <section className={styles.releaseHero}>
                <Container className={styles.releaseHeroInner}>
                    <nav className={styles.releaseBreadcrumb} aria-label="Breadcrumb">
                        <Link href="/newsroom">Newsroom</Link>
                        <span className={styles.releaseBreadcrumbSep} aria-hidden>
                            /
                        </span>
                        <span className={styles.releaseBreadcrumbCurrent}>{stripTagsToPlainText(release.title)}</span>
                    </nav>

                    <div className={styles.releaseMeta}>
                        <span>{release.category || "News"}</span>
                        <span>{release.island || "Regional"}</span>
                        <span>{formatReleaseDate(dateValue)}</span>
                        <span>{formatReleaseTime(dateValue)}</span>
                    </div>

                    <h1 className={styles.releaseTitle}>{stripTagsToPlainText(release.title)}</h1>
                    {heroLead ? <p className={styles.releaseLead}>{heroLead}</p> : null}
                </Container>
            </section>

            <section className={styles.releaseContentSection}>
                <Container className={styles.releaseContentInner}>
                    <div className={styles.releaseContentSplit}>
                        <div className={styles.releaseMediaCol}>
                            <div className={styles.releaseImage}>
                                <Image
                                    src={heroImageSrc}
                                    alt={stripTagsToPlainText(release.title)}
                                    fill
                                    priority
                                    sizes="(max-width: 767px) min(100vw, 520px) 50vw"
                                    className={styles.releaseImageImg}
                                    unoptimized={heroImageRemote}
                                />
                            </div>
                        </div>

                        <div className={styles.releaseCopyCol}>
                            <aside className={styles.releaseSidebar}>
                                <h2>Release details</h2>
                                <ul>
                                    <li>
                                        <strong>Category:</strong> {release.category || "News"}
                                    </li>
                                    <li>
                                        <strong>Island:</strong> {release.island || "Regional"}
                                    </li>
                                    <li>
                                        <strong>Published:</strong> {formatReleaseDate(dateValue)}
                                    </li>
                                    <li>
                                        <strong>Time:</strong> {formatReleaseTime(dateValue)}
                                    </li>
                                </ul>
                            </aside>

                            <ReleaseArticleBody content={release.content} />

                            {outboundHref ? (
                                <div className={styles.releaseOutbound}>
                                    <a
                                        href={outboundHref}
                                        className={styles.visitWebsiteButton}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Visit Website
                                        <span className={styles.visitWebsiteArrow} aria-hidden>
                                            <SvgIcon icon="right-arrow-large" />
                                        </span>
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
