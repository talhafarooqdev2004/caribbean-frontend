"use client";

import styles from "./ReadyToShareYourStory.module.scss";

import { Container } from "../layout";
import { Button } from "../ui";
import { useRouter } from "next/navigation";
import { pushSubmitPressRelease } from "@/lib/push-submit-press-release";

export default function ReadyToShareYourStory() {
  const router = useRouter();

  return (
    <section className={styles.footerCTA}>
      <Container className={styles.footerCTAInner}>
        <h1>Ready to Share Your Story?</h1>

        <p>
          Position your news where Caribbean media professionals are already
          looking.
        </p>

        <div className={styles.ctaBtns}>
          <Button className={styles.pressReleaseBtn} onClick={() => pushSubmitPressRelease(router)}>
            Submit Your Press Release
          </Button>
          <Button variant="join-as-media" className={styles.viewPricingBtn} onClick={() => router.push("/pricing")}>
            View Campaign Options
          </Button>
        </div>
      </Container>
    </section>
  );
}
