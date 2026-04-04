import styles from "./AboutHeroSection.module.scss";

import { Container } from "../layout";

export default function AboutHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <span>🌊 About Us</span>

                <h1>About Carib Newswire</h1>

                <p>Building a trusted distribution layer for Caribbean news</p>
            </Container>
        </section>
    );
};