"use client";

import styles from "./HeroSection.module.scss";

import Image from "next/image";
import { Container } from "../layout";
import { Button, SvgIcon } from "../ui";
import { useRouter } from "next/navigation";
import { pushSubmitPressRelease } from "@/lib/push-submit-press-release";

export default function HomeHeroSection() {
  const router = useRouter();

  return (
    <section className={styles.heroSection}>
      <Container className={styles.heroSectionInner}>
        <div className={styles.detailSection}>
          <div className={styles.heroSectionBadge}>
            🌴 Premium Caribbean Press Distribution
          </div>

          <h1 className={styles.heroSectionHeading}>
            Share Your Story.{" "}
            <span className={styles.prominentText}>Reach Caribbean Media.</span>
          </h1>

          <p className={styles.heroSectionDescription}>
            Carib Newswire is the premium press distribution platform designed
            for the Caribbean and its global diaspora.
          </p>

          <div className={styles.ctaBtns}>
            <Button className={styles.submitReleaseBtn} onClick={() => pushSubmitPressRelease(router)}>
              Submit Your Press Release
              <SvgIcon icon="right-arrow-large" />
            </Button>
            <Button variant="join-as-media" onClick={() => router.push("/join-the-media-network")}>Join as Media</Button>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/images/hero-section-image-desktop.jpeg"
            alt="Hero Section Image"
            fill
            className={styles.heroSectionImage}
          />
        </div>
      </Container>
    </section>
  );
}