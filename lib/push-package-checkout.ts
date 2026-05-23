type MinimalRouter = {
    push: (href: string) => void;
    prefetch?: (href: string) => void;
};

type PackageId = "single" | "bundle";

function getSubmitterToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return window.localStorage.getItem("carib_token") ?? window.localStorage.getItem("caribbean_news_submitter_token");
}

export function packageCheckoutHref(packageId: PackageId, checkoutSessionId?: string) {
    const params = new URLSearchParams({ package: packageId });

    if (checkoutSessionId?.trim()) {
        params.set("checkoutSessionId", checkoutSessionId.trim());
    }

    return `/checkout?${params.toString()}`;
}

export function packageCheckoutLoginHref(packageId: PackageId, checkoutSessionId?: string) {
    return `/login?next=${encodeURIComponent(packageCheckoutHref(packageId, checkoutSessionId))}`;
}

export function prefetchPackageCheckoutLogin(router: MinimalRouter, packageId: PackageId) {
    router.prefetch?.(packageCheckoutLoginHref(packageId));
}

function clearCheckoutSessionStorage() {
    window.sessionStorage.removeItem("carib_checkout_session_id");
    window.sessionStorage.removeItem("carib_selected_package");
    window.sessionStorage.removeItem("carib_submission_form");
    window.sessionStorage.removeItem("carib_total_amount");
}

/**
 * Guests go straight to login (full document navigation) instead of `/checkout` first.
 * That server redirect caused a slow hop where header/footer painted before the login form.
 */
export function pushPackageCheckout(router: MinimalRouter, packageId: PackageId) {
    clearCheckoutSessionStorage();

    const token = getSubmitterToken();

    if (token) {
        router.push(packageCheckoutHref(packageId));
        return;
    }

    window.location.assign(packageCheckoutLoginHref(packageId));
}
