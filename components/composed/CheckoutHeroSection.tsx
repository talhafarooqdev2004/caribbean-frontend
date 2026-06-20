import styles from "./CheckoutHeroSection.module.scss";

import { Lock } from "lucide-react";
import { Container } from "../layout";

export default function CheckoutHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <span className={styles.badge}>
                    <Lock size={14} strokeWidth={2} aria-hidden />
                    Secure Checkout
                </span>

                <h1>
                    Complete Your <span>Order</span>
                </h1>

                <p>Complete your order to start distributing your news across the Caribbean</p>
            </Container>
        </section>
    );
}
