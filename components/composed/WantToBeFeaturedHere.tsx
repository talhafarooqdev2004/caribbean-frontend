"use client";

import styles from "./WantToBeFeaturedHere.module.scss";

import { Container } from "../layout";
import { Button } from "../ui";
import { useRouter } from "next/navigation";
import { pushSubmitPressRelease } from "@/lib/push-submit-press-release";

export default function WantToBeFeaturedHere() {
    const router = useRouter();

    return (
        <section className={styles.footerCTA}>
            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
                    <path d="M0,0 H1440 V28 C1140,28 1020,56 780,42 C540,28 360,10 0,34 Z" />
                </svg>
            </div>

            <Container className={styles.footerCTAInner}>
                <span className={styles.icon}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.6574 2.3326L12.8281 15.1619" stroke="#FFC400" strokeWidth="2.04103" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M25.658 2.3326L17.4939 25.6586L12.8287 15.1619L2.33203 10.4967L25.658 2.3326Z" stroke="#FFC400" strokeWidth="2.04103" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>

                <h1>
                    <span className={styles.headingLead}>Want to be</span>
                    <span className={styles.headingAccent}>featured here?</span>
                </h1>

                <p>Submit your press release and reach Caribbean media professionals across 15+ islands.</p>

                <Button className={styles.submitBtn} onClick={() => pushSubmitPressRelease(router)}>
                    Submit Your Press Release
                </Button>
            </Container>
        </section>
    );
};
