/** Returns a safe http(s) href for display, or null if empty/invalid. */
export function safeOutboundLinkHref(raw: string | null | undefined): string | null {
    if (!raw?.trim()) {
        return null;
    }

    let s = raw.trim();

    if (/^www\./i.test(s)) {
        s = `https://${s}`;
    }

    try {
        const u = new URL(s);

        if (u.protocol !== "http:" && u.protocol !== "https:") {
            return null;
        }

        return u.href;
    } catch {
        return null;
    }
}
