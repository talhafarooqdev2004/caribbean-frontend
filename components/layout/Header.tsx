import styles from "./Header.module.scss";

import Image from "next/image";
import Container from "./Container";
import { Button, SvgIcon } from "../ui";
import Link from "next/link";

export default function Header() {
    return (
        <header className={styles.header}>
            <Container className={styles.headerInner}>
                <Image
                    src="/images/brand-logo.svg"
                    alt="Brand Logo"
                    width={145}
                    height={100}
                    className={styles.logoImg}
                />

                <nav>
                    <ul className={styles.navList}>
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
                </nav>

                <Button className={styles.submitReleasebtn} size="md">Submit Release</Button>

                <div className={styles.menuWrapper}>
                    <SvgIcon icon="menu" />
                </div>
            </Container>
        </header>
    );
};