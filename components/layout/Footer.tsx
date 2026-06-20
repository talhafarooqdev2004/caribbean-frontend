import styles from "./Footer.module.scss";

import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import CookiePreferencesLink from "./CookiePreferencesLink";

const platformLinks = [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Newsroom", href: "/newsroom" },
    { label: "For Media", href: "/join-the-media-network" },
    { label: "Newsletter", href: "/#newsletter" },
];

const contactLinks = [
    { label: "info@caribnewswire.com", href: "mailto:info@caribnewswire.com" },
    { label: "Submit a Release", href: "/submit-your-press-release" },
    { label: "Media Enquiries", href: "/contact-us" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
];

const socialLinks = [
    {
        label: "X", href: "#", icon: <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.58675 9.99597L3.58275 5.73997L-0.00124998 -2.89679e-05H2.84075L5.09475 3.61197L7.62875 -2.89679e-05H8.53875L5.51475 4.29797L9.08475 9.99597H6.24275L4.01675 6.43997L1.49675 9.99597H0.58675ZM6.64875 9.25397H7.75475L2.43475 0.741971H1.32875L6.64875 9.25397Z" fill="white" fillOpacity="0.5" />
        </svg>
    },
    {
        label: "LinkedIn", href: "#", icon: <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.224813 10.15V3.09402H1.40081V10.15H0.224813ZM0.812813 1.59602C0.579479 1.59602 0.383479 1.52136 0.224813 1.37202C0.0754792 1.21336 0.000812538 1.01736 0.000812538 0.784024C0.000812538 0.550691 0.0754792 0.364024 0.224813 0.224024C0.383479 0.0746906 0.579479 2.40803e-05 0.812813 2.40803e-05C1.03681 2.40803e-05 1.22815 0.0746906 1.38681 0.224024C1.54548 0.364024 1.62481 0.550691 1.62481 0.784024C1.62481 1.01736 1.54548 1.21336 1.38681 1.37202C1.22815 1.52136 1.03681 1.59602 0.812813 1.59602ZM3.47609 10.15V3.09402H4.54009L4.59609 4.32602C4.82009 3.88736 5.13743 3.54669 5.54809 3.30402C5.96809 3.05202 6.44409 2.92602 6.97609 2.92602C7.52676 2.92602 8.00276 3.03802 8.40409 3.26202C8.80543 3.47669 9.11809 3.80802 9.34209 4.25602C9.56609 4.69469 9.67809 5.25469 9.67809 5.93602V10.15H8.50209V6.06202C8.50209 5.35269 8.34343 4.82069 8.02609 4.46602C7.71809 4.11136 7.27943 3.93402 6.71009 3.93402C6.31809 3.93402 5.96809 4.03202 5.66009 4.22802C5.35209 4.41469 5.10476 4.69002 4.91809 5.05402C4.74076 5.40869 4.65209 5.85202 4.65209 6.38402V10.15H3.47609Z" fill="white" fillOpacity="0.5" />
        </svg>
    },
    {
        label: "Instagram", href: "#", icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-0.000843711 10.248V1.5974e-05H10.2472V10.248H-0.000843711ZM0.895156 9.35202H9.35116V0.896016H0.895156V9.35202ZM3.38716 6.86002V3.38802H6.85916V6.86002H3.38716Z" fill="white" fillOpacity="0.5" />
        </svg>
    },
    {
        label: "Facebook", href: "#", icon: <svg width="5" height="11" viewBox="0 0 5 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.07903 10.08V1.93196C1.07903 1.48396 1.1537 1.11996 1.30303 0.839956C1.45236 0.550622 1.6717 0.340622 1.96103 0.209955C2.2597 0.0699556 2.6237 -4.43459e-05 3.05303 -4.43459e-05H3.85103V1.00796H3.23503C2.8897 1.00796 2.6377 1.07796 2.47903 1.21796C2.3297 1.35796 2.25503 1.60529 2.25503 1.95996V10.08H1.07903ZM0.00103127 4.01796V3.02396H4.03303V4.01796H0.00103127Z" fill="white" fillOpacity="0.5" />
        </svg>
    },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Container className={styles.footerInner}>
                <div className={styles.footerTop}>
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.footerBrandLogoLink}>
                            <Image
                                src="/images/brand-logo-white.svg"
                                alt="Carib Newswire"
                                width={180}
                                height={33}
                                className={styles.footerBrandLogo}
                            />
                        </Link>

                        <p>Premium press distribution for the Caribbean and its global diaspora. Editorial quality, regional reach.</p>

                        <ul className={styles.socials}>
                            {socialLinks.map((social) => (
                                <li key={social.label}>
                                    <Link href={social.href} aria-label={social.label}>
                                        {social.icon}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <nav className={styles.footerCol}>
                        <span className={styles.colTitle}>Platform</span>
                        <ul>
                            {platformLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav className={styles.footerCol}>
                        <span className={styles.colTitle}>Contact</span>
                        <ul>
                            {contactLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <hr className={styles.footerSeprator} />

                <div className={styles.footerBottom}>
                    <p className={styles.copyRightReserved}>© 2026 Carib Newswire. All rights reserved.</p>

                    <ul className={styles.legalLinks}>
                        <li><Link href="/terms-of-service">Terms</Link></li>
                        <li><Link href="/privacy-policy">Privacy</Link></li>
                        <li><CookiePreferencesLink className={styles.legalButton} /></li>
                    </ul>
                </div>
            </Container>
        </footer>
    );
};

function XIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07Z" />
        </svg>
    );
}
