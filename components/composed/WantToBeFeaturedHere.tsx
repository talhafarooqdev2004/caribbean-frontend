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
            <Container className={styles.footerCTAInner}>
                <h1>Want to be featured here?</h1>

                <p>Submit your press release and reach Caribbean media professionals.</p>

                <Button onClick={() => pushSubmitPressRelease(router)}>Submit Your Press Release</Button>
            </Container>
        </section>
    );
};
