import styles from "./ContactUsHeroSection.module.scss";

import { Container } from "../layout";

export default function ContactUsHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <span className={styles.badge}>Contact</span>

                <h1>Get in <span>Touch</span></h1>

                <p>Have a question, media inquiry, or custom request? We&apos;d love to hear from you.</p>

                <span className={styles.divider} aria-hidden="true" />
            </Container>
        </section>
    );
};
