"use client";

import styles from "./ReadyToShareYourNews.module.scss";

import { Container } from "../layout";
import { Button } from "../ui";
import { useRouter } from "next/navigation";
import { pushSubmitPressRelease } from "@/lib/push-submit-press-release";

export default function ReadyToShareYourNews() {
  const router = useRouter();

  return (
    <section className={styles.footerCTA}>
      <Container className={styles.footerCTAInner}>
        <h1>Ready to Share Your News?</h1>

        <p>
          Position your story where Caribbean media professionals are already
          looking.
        </p>

        <div className={styles.ctaBtns}>
          <Button className={styles.pressReleaseBtn} onClick={() => pushSubmitPressRelease(router)}>
            Submit Your Press Release
          </Button>
          <Button variant="join-as-media" className={styles.viewPricingBtn} onClick={() => router.push("/pricing")}>
            View Pricing
          </Button>
        </div>
      </Container>
    </section>
  );
}
