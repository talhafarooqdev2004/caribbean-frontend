"use client";

import { openCookiePreferences } from "@/lib/cookie-consent";

type CookiePreferencesLinkProps = {
    className?: string;
};

export default function CookiePreferencesLink({ className }: CookiePreferencesLinkProps) {
    return (
        <button type="button" className={className} onClick={openCookiePreferences}>
            Cookies
        </button>
    );
}
