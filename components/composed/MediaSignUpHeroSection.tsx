"use client";

import styles from "./MediaSignUpHeroSection.module.scss";

import { Container } from "../layout";
import { Button, SvgIcon } from "../ui";
import { smoothScrollToElement } from "@/utils/scroll";

export default function MediaSignUpHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <h1>Join the Caribbean Media Network</h1>

                <p>Early access for journalists, editors, and media professionals across the region and diaspora.</p>

                <Button onClick={() => smoothScrollToElement("apply-for-early-access")}>
                    <SvgIcon icon="rocket-icon" />
                    Apply for Early Access
                </Button>
            </Container>
        </section>
    );
};