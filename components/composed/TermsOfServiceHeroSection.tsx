import styles from "./TermsOfServiceHeroSection.module.scss";

import { Container } from "../layout";

export default function TermsOfServiceHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <div className={styles.heroSectionBadge}>⚖️ Legal</div>

                <h1>Terms of Service</h1>

                <p>Your agreement with Carib Newswire</p>

                <p>Effective Date: April 1, 2026</p>
            </Container>
        </section>
    );
};
