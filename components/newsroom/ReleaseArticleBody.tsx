import { isRichHtmlContent } from "@/lib/press-release-content-format";
import { sanitizePressReleaseHtml } from "@/lib/sanitize-release-html";

import styles from "@/app/newsroom/[slug]/NewsroomReleasePage.module.scss";

type ReleaseArticleBodyProps = {
    content: string;
};

export function ReleaseArticleBody({ content }: ReleaseArticleBodyProps) {
    if (isRichHtmlContent(content)) {
        const html = sanitizePressReleaseHtml(content);

        return (
            <article
                className={`${styles.releaseArticle} ${styles.releaseArticleRich}`}
                // Safe HTML: sanitized with DOMPurify (strict allowlist) before render.
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    const paragraphs = content
        .split(/\n{2,}|\r\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    return (
        <article className={styles.releaseArticle}>
            {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
        </article>
    );
}
