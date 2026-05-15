import styles from "./SubmitYourPressReleaseHeroSection.module.scss";

import { Container } from "../layout";

export default function SubmitYourPressReleaseHeroSection() {
  return (
    <section className={styles.heroSection}>
      <Container className={styles.heroSectionInner}>
        <div className={styles.heroSectionBadge}>📝 Submit Your Story</div>

        <h1>Submit Your Press Release</h1>

        <p>Share your story with the Caribbean&apos;s leading media network</p>
      </Container>
    </section>
  );
}
