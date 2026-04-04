"use client";

import styles from "./Header.module.scss";

import Image from "next/image";
import Container from "./Container";
import { Button, SvgIcon } from "../ui";
import Link from "next/link";
import React from "react";

const navLinks = [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Newsroom", href: "/newsroom" },
    { label: "For Media", href: "/for-media" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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

                <nav className={styles.desktopNav}>
                    <ul className={styles.navList}>
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Button className={styles.submitReleasebtn} size="md">Submit Release</Button>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    type="button"
                    aria-label="Toggle menu"
                >
                    <SvgIcon icon="menu" />
                </button>
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
                        <Button size="md" className={styles.mobileSubmitBtn}>
                            Submit Release
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};