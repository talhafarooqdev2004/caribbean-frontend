"use client";

import styles from "./Header.module.scss";

import Image from "next/image";
import Container from "./Container";
import { Button, SvgIcon } from "../ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { X } from "lucide-react";
import { prefetchSubmitPressReleaseLogin, pushSubmitPressRelease } from "@/lib/push-submit-press-release";

const navLinks = [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Newsroom", href: "/newsroom" },
    { label: "For Media", href: "/join-the-media-network" },
];

const ANNOUNCEMENT_STORAGE_KEY = "carib_announcement_dismissed";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [showAnnouncement, setShowAnnouncement] = React.useState(false);
    /** Match SSR first paint so hydration succeeds; sync from storage only after mount. */
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [submitter, setSubmitter] = React.useState<{ firstName: string } | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        const dismissed = window.localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
        setShowAnnouncement(dismissed !== "true");
    }, []);

    React.useEffect(() => {
        let active = true;

        function syncFromStorage() {
            const storedToken = window.localStorage.getItem("carib_token");
            const storedUser = window.localStorage.getItem("carib_user");
            const authenticated = Boolean(storedToken);
            setIsAuthenticated(authenticated);

            if (!authenticated || !storedUser) {
                setSubmitter(null);
                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser);
                setSubmitter(parsedUser?.firstName ? { firstName: parsedUser.firstName } : null);
            } catch {
                setSubmitter(null);
            }
        }

        syncFromStorage();

        fetch("/api/auth/me", { cache: "no-store" })
            .then((response) => response.ok ? response.json() : null)
            .then((payload) => {
                if (!active) return;

                if (payload?.user?.firstName) {
                    setIsAuthenticated(true);
                    setSubmitter({ firstName: payload.user.firstName });
                    window.localStorage.setItem("carib_user", JSON.stringify(payload.user));
                } else {
                    syncFromStorage();
                }
            })
            .catch(() => null);

        return () => {
            active = false;
        };
    }, [pathname]);

    React.useEffect(() => {
        prefetchSubmitPressReleaseLogin(router);
    }, [router]);

    function dismissAnnouncement() {
        setShowAnnouncement(false);
        window.localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, "true");
    }

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        window.localStorage.removeItem("carib_token");
        window.localStorage.removeItem("carib_user");
        window.localStorage.removeItem("caribbean_news_submitter_token");
        setIsAuthenticated(false);
        setSubmitter(null);
        setIsMenuOpen(false);
        router.push("/");
        router.refresh();
    }

    return (
        <header
            className={styles.header}
            data-announcement={showAnnouncement ? "visible" : "hidden"}
        >
            {showAnnouncement ? (
                <div className={styles.announcementBar}>
                    <Container className={styles.announcementInner}>
                        <div className={styles.announcementContent}>
                            <span className={styles.announcementBadge}>New</span>
                            <p className={styles.announcementText}>
                                Carib Newswire now covers 20+ Caribbean territories.{" "}
                                <Link href="/newsroom" className={styles.announcementLink}>
                                    Explore coverage →
                                </Link>
                            </p>
                        </div>
                        <button
                            type="button"
                            className={styles.announcementClose}
                            onClick={dismissAnnouncement}
                            aria-label="Dismiss announcement"
                        >
                            <X color="#FFFFFF66" width={18} height={20} strokeWidth={2} />
                        </button>
                    </Container>
                </div>
            ) : null}

            <Container className={styles.headerInner}>
                <Link href="/" className={styles.logoLink}>
                    <Image
                        src="/images/brand-logo.svg"
                        alt="Carib Newswire"
                        width={100}
                        height={100}
                        className={styles.logoImg}
                        priority
                    />
                </Link>

                <div className={styles.headerRight}>
                    <nav className={styles.desktopNav} aria-label="Main navigation">
                        <ul className={styles.navList}>
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.headerActions}>
                        {submitter ? <span className={styles.userGreeting}>Hi, {submitter.firstName}</span> : null}
                        {!isAuthenticated ? (
                            <Button
                                className={styles.loginBtn}
                                size="md"
                                variant="secondary"
                                onClick={() => router.push("/login")}
                            >
                                Login
                            </Button>
                        ) : null}
                        <Button
                            className={styles.submitReleasebtn}
                            size="md"
                            onClick={() => {
                                pushSubmitPressRelease(router);
                            }}
                        >
                            Submit Release
                        </Button>
                        {submitter ? (
                            <Button
                                className={styles.logoutBtn}
                                size="md"
                                variant="secondary"
                                onClick={() => router.push("/portal")}
                            >
                                My Portal
                            </Button>
                        ) : null}
                        {submitter ? (
                            <Button
                                className={styles.logoutBtn}
                                size="md"
                                variant="secondary"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        ) : null}
                    </div>

                    <button
                        className={styles.menuToggle}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X size={22} strokeWidth={2} />
                        ) : (
                            <SvgIcon icon="menu" />
                        )}
                    </button>
                </div>
            </Container>

            {isMenuOpen ? (
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuHeader}>
                        <Link
                            href="/"
                            className={styles.mobileMenuLogoLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Image
                                src="/images/brand-logo.svg"
                                alt="Carib Newswire"
                                width={100}
                                height={100}
                                className={styles.mobileMenuLogo}
                            />
                        </Link>
                        <button
                            type="button"
                            className={styles.mobileMenuClose}
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={22} strokeWidth={2} />
                        </button>
                    </div>

                    <nav className={styles.mobileNav} aria-label="Mobile navigation">
                        <ul className={styles.mobileNavList}>
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className={styles.mobileButtonWrapper}>
                        {submitter ? <span className={styles.userGreeting}>Hi, {submitter.firstName}</span> : null}
                        {!isAuthenticated ? (
                            <Button
                                size="md"
                                variant="secondary"
                                className={styles.mobileSubmitBtn}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    router.push("/login");
                                }}
                            >
                                Login
                            </Button>
                        ) : null}
                        <Button
                            size="md"
                            className={styles.mobileSubmitBtn}
                            onClick={() => {
                                setIsMenuOpen(false);
                                pushSubmitPressRelease(router);
                            }}
                        >
                            Submit Release
                        </Button>
                        {submitter ? (
                            <Button
                                size="md"
                                variant="secondary"
                                className={styles.mobileSubmitBtn}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    router.push("/portal");
                                }}
                            >
                                My Portal
                            </Button>
                        ) : null}
                        {submitter ? (
                            <Button
                                size="md"
                                variant="secondary"
                                className={styles.mobileSubmitBtn}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </header>
    );
};
