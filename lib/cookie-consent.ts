export const COOKIE_CONSENT_STORAGE_KEY = "carib_cookie_consent_v1";
export const OPEN_COOKIE_PREFERENCES_EVENT = "carib:open-cookie-preferences";

export type CookieConsentPreferences = {
    necessary: true;
    analytics: boolean;
    marketing: boolean;
    updatedAt: string;
};

export function resolveOptionalCookiePreferences(saved?: CookieConsentPreferences | null) {
    const resolved = saved === undefined ? readCookieConsent() : saved;

    return {
        analytics: resolved?.analytics ?? false,
        marketing: resolved?.marketing ?? false,
    };
}

export function readCookieConsent(): CookieConsentPreferences | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;

        if (parsed.necessary !== true) {
            return null;
        }

        return {
            necessary: true,
            analytics: Boolean(parsed.analytics),
            marketing: Boolean(parsed.marketing),
            updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

export function writeCookieConsent(preferences: Pick<CookieConsentPreferences, "analytics" | "marketing">) {
    const payload: CookieConsentPreferences = {
        necessary: true,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("carib:cookie-consent-updated", { detail: payload }));

    return payload;
}

export function openCookiePreferences() {
    window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
}
