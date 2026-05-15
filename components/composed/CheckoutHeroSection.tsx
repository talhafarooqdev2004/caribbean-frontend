import styles from "./CheckoutHeroSection.module.scss";

import { Container } from "../layout";

export default function CheckoutHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <div className={styles.heroSectionBadge}>💬 Checkout</div>

                <h1>Checkout</h1>

                <p>Have a question about your order or need assistance during checkout? We&apos;re here to help.</p>
            </Container>
        </section>
    );
};