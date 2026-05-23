import { type PressReleaseRecord } from "./press-release-types";

const fallbackImage = "/images/temp/latest-news-1.svg";

/** Normalize DB path to a same-origin `/uploads/...` URL (proxied to EC2 in production). */
export function getReleaseImageSrc(release: Pick<PressReleaseRecord, "coverImagePath">) {
    if (!release.coverImagePath) {
        return fallbackImage;
    }

    const raw = release.coverImagePath.trim();

    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    if (raw.startsWith("/uploads/")) {
        return raw;
    }

    if (raw.startsWith("uploads/")) {
        return `/${raw}`;
    }

    return raw.startsWith("/") ? raw : `/${raw}`;
}

/** Uploaded assets must bypass Next image optimizer — Amplify cannot optimize proxied `/uploads` reliably. */
export function shouldUnoptimizeReleaseImage(src: string) {
    return /^https?:\/\//i.test(src) || /^blob:/i.test(src) || src.startsWith("/uploads/");
}

export function formatReleaseDate(value: string | null) {
    if (!value) {
        return "Unpublished";
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export function formatReleaseTime(value: string | null) {
    if (!value) {
        return "";
    }

    return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }).format(new Date(value));
}

export function getReleaseUrl(release: Pick<PressReleaseRecord, "slug" | "id">) {
    return `/newsroom/${release.slug || release.id}`;
}
