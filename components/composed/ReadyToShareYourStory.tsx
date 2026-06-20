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
        <header className={styles.header}>
          <span className={styles.eyebrow}>Get started today</span>
          <h2>
            <span className={styles.headingLead}>Turn Announcements</span>
            <span className={styles.headingAccent}>Into Visibility.</span>
          </h2>
        </header>

        <p>
          Join hundreds of organisations already distributing through Carib
          Newswire. Submit your first release today or talk to us about a campaign.
        </p>

        <div className={styles.ctaBtns}>
          <Button className={styles.pressReleaseBtn} onClick={() => pushSubmitPressRelease(router)}>
            Submit Your Release
          </Button>
          <Button variant="join-as-media" className={styles.talkToSalesBtn} onClick={() => router.push("/contact-us")}>
            Talk to Sales
          </Button>
        </div>

        <span className={styles.metaLine}>
          Editorial review included · No hidden fees · Credits valid 6 months
        </span>
      </Container>
    </section>
  );
}
