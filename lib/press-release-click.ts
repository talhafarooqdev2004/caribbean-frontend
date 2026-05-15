"use client";

export function trackPressReleaseClick(releaseId: string): void {
    const url = `/api/press-releases/${encodeURIComponent(releaseId)}/click`;

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(url);
        return;
    }

    void fetch(url, { method: "POST", keepalive: true }).catch(() => null);
}
