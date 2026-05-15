import styles from "./ContactUsHeroSection.module.scss";

import { Container } from "../layout";

export default function ContactUsHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <div className={styles.heroSectionBadge}>💬 Contact</div>

                <h1>Get in Touch</h1>

                <p>Have a question, media inquiry, or custom request? We&apos;d love to hear from you.</p>
            </Container>
        </section>
    );
};