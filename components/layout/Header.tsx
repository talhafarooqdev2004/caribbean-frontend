"use client";

import styles from "./Header.module.scss";

import Image from "next/image";
import Container from "./Container";
import { Button, SvgIcon } from "../ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { prefetchSubmitPressReleaseLogin, pushSubmitPressRelease } from "@/lib/push-submit-press-release";

const navLinks = [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Newsroom", href: "/newsroom" },
    { label: "For Media", href: "/join-the-media-network" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    /** Match SSR first paint so hydration succeeds; sync from storage only after mount. */
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [submitter, setSubmitter] = React.useState<{ firstName: string } | null>(null);
    const router = useRouter();
    const pathname = usePathname();

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
        <header className={styles.header}>
            <Container className={styles.headerInner}>
                <Link href="/" className={styles.logoLink}>
                    <Image
                        src="/images/brand-logo.svg"
                        alt="Brand Logo"
                        width={145}
                        height={100}
                        className={styles.logoImg}
                    />
                </Link>

                <>
                    <nav className={styles.desktopNav}>
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
                            aria-label="Toggle menu"
                        >
                            <SvgIcon icon="menu" />
                        </button>
                </>
            </Container>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className={styles.mobileNav}>
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
            )}
        </header>
    );
};
