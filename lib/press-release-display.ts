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

    const time = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
    }).format(new Date(value));

    return `${time} EST`;
}

export function getReleaseUrl(release: Pick<PressReleaseRecord, "slug" | "id">) {
    return `/newsroom/${release.slug || release.id}`;
}

/** Normalize DB document path to a same-origin `/uploads/...` URL. */
export function getReleaseDocumentUrl(release: Pick<PressReleaseRecord, "documentPath">) {
    if (!release.documentPath?.trim()) {
        return null;
    }

    const raw = release.documentPath.trim();

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

export function getReleaseDocumentLabel(documentPath: string | null | undefined) {
    if (!documentPath?.trim()) {
        return "Download document";
    }

    const filename = documentPath.trim().split("/").pop() ?? "";
    const withoutTimestamp = filename.replace(/^\d{10,}-/, "");
    const base = withoutTimestamp || filename || "document";

    if (/\.pdf$/i.test(base)) {
        return "Download PDF";
    }

    if (/\.docx?$/i.test(base)) {
        return "Download document";
    }

    return "Download attachment";
}
