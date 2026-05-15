import { type PressReleaseRecord } from "./press-release-types";

const fallbackImage = "/images/temp/latest-news-1.svg";

export function getReleaseImageSrc(release: Pick<PressReleaseRecord, "coverImagePath">) {
    if (!release.coverImagePath) {
        return fallbackImage;
    }

    const raw = release.coverImagePath.trim();

    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    const uploadsPath = raw.startsWith("/uploads/")
        ? raw
        : raw.startsWith("uploads/")
          ? `/${raw}`
          : null;

    if (uploadsPath) {
        return uploadsPath;
    }

    return raw.startsWith("/") ? raw : `/${raw}`;
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
