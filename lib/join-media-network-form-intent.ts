/**
 * The join page only honors `#join-network-form` in the URL when the user was
 * sent here with intent (e.g. login “Join the network” or /register redirect).
 * Header and other links use `/join-the-media-network` without a hash.
 */

export const JOIN_MEDIA_NETWORK_FORM_ID = "join-network-form";

const INTENT_KEY = "carib_join_network_form_intent";
const INTENT_TTL_MS = 2 * 60 * 1000;

export function joinMediaNetworkFormHash(): string {
    return `#${JOIN_MEDIA_NETWORK_FORM_ID}`;
}

export function joinMediaNetworkFormHref(): string {
    return `/join-the-media-network${joinMediaNetworkFormHash()}`;
}

/** Call immediately before navigating to the join URL with the form hash (e.g. Link onClick). */
export function armJoinMediaNetworkFormIntent(): void {
    try {
        sessionStorage.setItem(INTENT_KEY, String(Date.now()));
    } catch {
        // private mode / quota
    }
}

/** Returns true if a fresh intent token exists (and removes it). */
export function consumeJoinMediaNetworkFormIntent(): boolean {
    try {
        const raw = sessionStorage.getItem(INTENT_KEY);
        if (!raw) {
            return false;
        }
        sessionStorage.removeItem(INTENT_KEY);
        const t = Number(raw);
        if (!Number.isFinite(t) || Date.now() - t > INTENT_TTL_MS) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}
