import styles from "./Footer.module.scss";

import Container from "./Container";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Container className={styles.footerInner}>
                <ul className={styles.footerList}>
                    <li>
                        <Link href="/" className={styles.footerBrandLogoLink}>
                            <Image
                                src="/images/brand-logo-white.svg"
                                alt="Brand Logo"
                                width={160}
                                height={100}
                                className={styles.footerBrandLogo}
                            />
                        </Link>

                        <p>Premium press distribution for the Caribbean and its global diaspora.</p>
                    </li>

                    <li className={styles.footerItem}>
                        <span>Platform</span>

                        <ul>
                            <li>
                                <Link href="/about">About</Link>
                            </li>
                            <li>
                                <Link href="/pricing">Pricing</Link>
                            </li>
                            <li>
                                <Link href="/newsroom">Newsroom</Link>
                            </li>
                            <li>
                                <Link href="/for-media">For Media</Link>
                            </li>
                        </ul>
                    </li>

                    <li className={styles.footerItem}>
                        <span>Contact</span>

                        <ul>
                            <li>info@caribnewswire.com</li>
                            <li>
                                <Link href="/terms-of-service">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy">Privacy Policy</Link>
                            </li>
                        </ul>
                    </li>
                </ul>

                <hr className={styles.footerSeprator} />

                <p className={styles.copyRightReserved}>© 2026 Carib Newswire. All rights reserved.</p>
            </Container>
        </footer>
    );
};