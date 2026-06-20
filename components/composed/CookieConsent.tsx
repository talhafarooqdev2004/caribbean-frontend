"use client";

import styles from "./CookieConsent.module.scss";

import Link from "next/link";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import {
    OPEN_COOKIE_PREFERENCES_EVENT,
    readCookieConsent,
    resolveOptionalCookiePreferences,
    writeCookieConsent,
} from "@/lib/cookie-consent";

export default function CookieConsent() {
    const [bannerVisible, setBannerVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [marketingEnabled, setMarketingEnabled] = useState(false);

    function syncPreferencesFromStorage() {
        const preferences = resolveOptionalCookiePreferences();
        setAnalyticsEnabled(preferences.analytics);
        setMarketingEnabled(preferences.marketing);
        return preferences;
    }

    function persistPreferences(analytics: boolean, marketing: boolean) {
        writeCookieConsent({ analytics, marketing });
        setAnalyticsEnabled(analytics);
        setMarketingEnabled(marketing);
    }

    useEffect(() => {
        const saved = readCookieConsent();

        if (!saved) {
            setBannerVisible(true);
            syncPreferencesFromStorage();
            return;
        }

        syncPreferencesFromStorage();
    }, []);

    useEffect(() => {
        if (!modalOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [modalOpen]);

    useEffect(() => {
        function handleOpenPreferences() {
            syncPreferencesFromStorage();
            setModalOpen(true);
            setBannerVisible(false);
        }

        window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpenPreferences);

        return () => {
            window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpenPreferences);
        };
    }, []);

    function openPreferencesModal() {
        syncPreferencesFromStorage();
        setModalOpen(true);
        setBannerVisible(false);
    }

    function closePreferencesModal() {
        persistPreferences(analyticsEnabled, marketingEnabled);
        setModalOpen(false);
    }

    function acceptAll() {
        persistPreferences(true, true);
        setBannerVisible(false);
        setModalOpen(false);
    }

    function acceptEssentialOnly() {
        persistPreferences(false, false);
        setBannerVisible(false);
        setModalOpen(false);
    }

    function savePreferences() {
        persistPreferences(analyticsEnabled, marketingEnabled);
        setBannerVisible(false);
        setModalOpen(false);
    }

    function toggleAnalytics() {
        const nextValue = !analyticsEnabled;
        persistPreferences(nextValue, marketingEnabled);
    }

    function toggleMarketing() {
        const nextValue = !marketingEnabled;
        persistPreferences(analyticsEnabled, nextValue);
    }

    if (!bannerVisible && !modalOpen) {
        return null;
    }

    return (
        <>
            {bannerVisible && !modalOpen ? (
                <section className={styles.banner} role="dialog" aria-labelledby="cookie-banner-title" aria-live="polite">
                    <h2 id="cookie-banner-title" className={styles.bannerTitle}>We use cookies</h2>
                    <p className={styles.bannerText}>
                        Carib Newswire uses cookies to keep you signed in, understand traffic, and improve the platform.
                        You can accept all cookies or manage your preferences.
                    </p>
                    <div className={styles.bannerActions}>
                        <button type="button" className={styles.bannerButtonPrimary} onClick={acceptAll}>
                            Accept all
                        </button>
                        <button type="button" className={styles.bannerButtonSecondary} onClick={openPreferencesModal}>
                            Manage preferences
                        </button>
                    </div>
                </section>
            ) : null}

            {modalOpen ? (
                <div className={styles.overlay} role="presentation" onClick={closePreferencesModal}>
                    <div
                        className={styles.dialog}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cookie-dialog-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className={styles.dialogHeader}>
                            <span className={styles.dialogEyebrow}>Cookie settings</span>
                            <h2 id="cookie-dialog-title" className={styles.dialogTitle}>Your privacy choices</h2>
                            <p className={styles.dialogIntro}>
                                Choose which cookies Carib Newswire may use. Essential cookies are required for sign-in,
                                checkout, and site security.
                            </p>
                        </header>

                        <div className={styles.preferenceList}>
                            <article className={styles.preferenceCard}>
                                <div className={styles.preferenceRow}>
                                    <div className={styles.preferenceCopy}>
                                        <strong>Essential cookies</strong>
                                        <span>Required for account sessions, checkout, and secure site access.</span>
                                    </div>
                                    <span className={styles.preferenceBadge}>Always on</span>
                                </div>
                            </article>

                            <article className={styles.preferenceCard}>
                                <div className={styles.preferenceRow}>
                                    <div className={styles.preferenceCopy}>
                                        <strong>Analytics cookies</strong>
                                        <span>Help us understand how visitors use Carib Newswire so we can improve performance.</span>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={analyticsEnabled}
                                        aria-label="Analytics cookies"
                                        className={clsx(styles.switch, analyticsEnabled && styles.switchOn)}
                                        onClick={toggleAnalytics}
                                    >
                                        <span className={styles.switchThumb} aria-hidden />
                                    </button>
                                </div>
                            </article>

                            <article className={styles.preferenceCard}>
                                <div className={styles.preferenceRow}>
                                    <div className={styles.preferenceCopy}>
                                        <strong>Marketing cookies</strong>
                                        <span>Used to measure campaigns and show more relevant Carib Newswire updates.</span>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={marketingEnabled}
                                        aria-label="Marketing cookies"
                                        className={clsx(styles.switch, marketingEnabled && styles.switchOn)}
                                        onClick={toggleMarketing}
                                    >
                                        <span className={styles.switchThumb} aria-hidden />
                                    </button>
                                </div>
                            </article>
                        </div>

                        <footer className={styles.dialogFooter}>
                            <button type="button" className={styles.modalButtonPrimary} onClick={savePreferences}>
                                Save preferences
                            </button>
                            <button type="button" className={styles.modalButtonSecondary} onClick={acceptAll}>
                                Accept all cookies
                            </button>
                            <button type="button" className={styles.modalButtonTertiary} onClick={acceptEssentialOnly}>
                                Essential cookies only
                            </button>
                            <p className={styles.policyLink}>
                                Read more in our{" "}
                                <Link href="/privacy-policy#cookies" onClick={closePreferencesModal}>
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </footer>
                    </div>
                </div>
            ) : null}
        </>
    );
}
