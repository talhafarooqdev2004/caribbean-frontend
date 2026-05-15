const NBSP = /\u00a0/g;

/** Strip tags and collapse whitespace for list/card blurbs (summary or body may contain HTML). */
export function stripTagsToPlainText(value: string | null | undefined): string {
    if (!value?.trim()) {
        return "";
    }

    let text = value.replace(/<[^>]*>/g, " ");
    text = text.replace(NBSP, " ");
    text = text
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/g, "'");

    return text.replace(/\s+/g, " ").trim();
}

export function truncatePlainExcerpt(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    const slice = text.slice(0, maxLength);
    const lastSpace = slice.lastIndexOf(" ");
    const cut = lastSpace > maxLength * 0.55 ? lastSpace : maxLength;

    return `${slice.slice(0, cut).trim()}…`;
}

/** One-line preview for newsroom cards, homepage latest, featured carousel, portal bookmarks. */
export function releaseCardExcerpt(
    release: { summary: string; content: string },
    maxLength = 220,
): string {
    const fromSummary = stripTagsToPlainText(release.summary);

    if (fromSummary) {
        return truncatePlainExcerpt(fromSummary, maxLength);
    }

    return truncatePlainExcerpt(stripTagsToPlainText(release.content), maxLength);
}

/** Plain-text subtitle under the headline on the full newsroom article page. */
export function releaseHeroLead(release: { summary: string; content: string }, maxLength = 420): string {
    const fromSummary = stripTagsToPlainText(release.summary);

    if (fromSummary) {
        return truncatePlainExcerpt(fromSummary, maxLength);
    }

    return truncatePlainExcerpt(stripTagsToPlainText(release.content), maxLength);
}
