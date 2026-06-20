"use client";

import styles from "./ReadyToShareCaribbeanMedia.module.scss";

import { Container } from "../layout";
import { Button } from "../ui";
import { useRouter } from "next/navigation";
import { pushSubmitPressRelease } from "@/lib/push-submit-press-release";

export default function ReadyToShareCaribbeanMedia() {
    const router = useRouter();

    return (
        <section className={styles.readyToShare}>
            <Container className={styles.readyToShareInner}>
                <span className={styles.eyebrow}>Ready to share?</span>

                <h2>
                    <span>Position</span>
                    <span>your story</span>
                    <span>where</span>
                    <span><em>Caribbean</em></span>
                    <span><em>media</em> is</span>
                    <span>already</span>
                    <span>looking.</span>
                </h2>

                <p>
                    Join the region&apos;s leading press distribution platform and put your news in front of
                    the journalists, editors, and media professionals who matter most.
                </p>

                <div className={styles.actions}>
                    <Button className={styles.submitReleaseBtn} onClick={() => pushSubmitPressRelease(router)}>Submit Your Press Release</Button>
                    <Button className={styles.viewPricingBtn} variant="outline-black" onClick={() => router.push("/pricing")}>View Pricing</Button>
                </div>
            </Container>
        </section>
    );
};
