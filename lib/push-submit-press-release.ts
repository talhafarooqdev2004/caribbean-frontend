const SUBMIT_PATH = "/submit-your-press-release";

/** Login with return path to the submit page (same shape as server redirect from submit route). */
export const SUBMIT_PRESS_RELEASE_LOGIN_HREF = `/login?next=${encodeURIComponent(SUBMIT_PATH)}`;

type MinimalRouter = {
    push: (href: string) => void;
    prefetch?: (href: string) => void;
};

function getSubmitterToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }
    return window.localStorage.getItem("carib_token") ?? window.localStorage.getItem("caribbean_news_submitter_token");
}

/** Warm the login RSC payload so client navigations from CTAs paint the form immediately. */
export function prefetchSubmitPressReleaseLogin(router: MinimalRouter) {
    router.prefetch?.(SUBMIT_PRESS_RELEASE_LOGIN_HREF);
}

/**
 * Guests should not hit `/submit-your-press-release` first (server session check + redirect);
 * that caused a slow double hop and a bare header/footer on `/login?next=...` while the page streamed.
 */
export function pushSubmitPressRelease(router: MinimalRouter) {
    const token = getSubmitterToken();
    router.push(token ? SUBMIT_PATH : SUBMIT_PRESS_RELEASE_LOGIN_HREF);
}
