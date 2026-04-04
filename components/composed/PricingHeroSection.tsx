import styles from "./PricingHeroSection.module.scss";

import { Container } from "../layout";

export default function PricingHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <h1>Pricing</h1>

                <p>Transparent pricing designed for organizations of all sizes</p>
            </Container>
        </section>
    );
};