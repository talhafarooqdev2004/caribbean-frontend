import { stripTagsToPlainText } from "./press-release-list-excerpt";

const WORDS_PER_MINUTE = 200;

function countWords(value: string | null | undefined): number {
    return stripTagsToPlainText(value).split(/\s+/).filter(Boolean).length;
}

function estimateReadingMinutes(content: string, summary = ""): number {
    const contentWords = countWords(content);
    const wordCount = contentWords > 0 ? contentWords : countWords(summary);

    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function getPressReleaseReadingMinutes(
    release: { readingMinutes?: number | null; content?: string; summary?: string },
): number {
    if (typeof release.readingMinutes === "number" && Number.isFinite(release.readingMinutes)) {
        return Math.max(1, Math.round(release.readingMinutes));
    }

    return estimateReadingMinutes(release.content || "", release.summary || "");
}
