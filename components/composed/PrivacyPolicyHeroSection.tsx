import styles from "./PrivacyPolicyHeroSection.module.scss";

import { Container } from "../layout";

export default function PrivacyPolicyHeroSection() {
  return (
    <section className={styles.heroSection}>
      <Container className={styles.heroSectionInner}>
        <div className={styles.heroSectionBadge}>🔒 Legal</div>

        <h1>Privacy Policy</h1>

        <p>How we collect, use, and protect your information</p>

        <p>Effective Date: April 1, 2026</p>
      </Container>
    </section>
  );
}
