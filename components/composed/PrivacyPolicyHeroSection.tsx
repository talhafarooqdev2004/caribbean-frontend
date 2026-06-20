import styles from "./PrivacyPolicyHeroSection.module.scss";

import { Container } from "../layout";

export default function PrivacyPolicyHeroSection() {
  return (
    <section className={styles.heroSection}>
      <Container className={styles.heroSectionInner}>
        <span className={styles.badge}>Legal</span>

        <h1>Privacy <span>Policy</span></h1>

        <p>How we collect, use, and protect your information</p>

        <span className={styles.lastUpdated}>
          <CalendarIcon />
          Last updated: March 18, 2026
        </span>
      </Container>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
