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
    getReleaseDocumentLabel,
    getReleaseDocumentUrl,
    getReleaseImageSrc,
    shouldUnoptimizeReleaseImage,
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
    const heroImageUnoptimized = shouldUnoptimizeReleaseImage(heroImageSrc);
    const outboundHref = safeOutboundLinkHref(release.outboundLink);
    const documentHref = getReleaseDocumentUrl(release);
    const documentLabel = getReleaseDocumentLabel(release.documentPath);

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

            <div className={styles.releaseCurve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z" />
                </svg>
            </div>

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
                                    unoptimized={heroImageUnoptimized}
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
                                    {release.summary?.trim() ? (
                                        <li>
                                            <strong>Summary:</strong> {stripTagsToPlainText(release.summary)}
                                        </li>
                                    ) : null}
                                    <li>
                                        <strong>Time:</strong> {formatReleaseTime(dateValue)}
                                    </li>
                                    {documentHref ? (
                                        <li>
                                            <strong>Attachment:</strong>{" "}
                                            <a
                                                href={documentHref}
                                                className={styles.releaseDocumentLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                {documentLabel}
                                            </a>
                                        </li>
                                    ) : null}
                                </ul>
                            </aside>

                            <ReleaseArticleBody content={release.content} />

                            {documentHref ? (
                                <div className={styles.releaseDocument}>
                                    <a
                                        href={documentHref}
                                        className={styles.downloadDocumentButton}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                    >
                                        {documentLabel}
                                        <span className={styles.downloadDocumentArrow} aria-hidden>
                                            <SvgIcon icon="right-arrow-large" />
                                        </span>
                                    </a>
                                </div>
                            ) : null}

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
