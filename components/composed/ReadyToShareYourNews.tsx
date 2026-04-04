import styles from "./ReadyToShareYourNews.module.scss";

import { Container } from "../layout";
import { Button } from "../ui";

export default function ReadyToShareYourNews() {
    return (
        <section className={styles.footerCTA}>
            <Container className={styles.footerCTAInner}>
                <h1>Ready to Share Your News?</h1>

                <p>Position your story where Caribbean media professionals are already looking.</p>

                <div className={styles.ctaBtns}>
                    <Button className={styles.pressReleaseBtn}>Submit Your Press Release</Button>
                    <Button
                        variant="outline"
                        className={styles.viewPricingBtn}
                    >
                        View Pricing
                    </Button>
                </div>
            </Container>
        </section>
    );
};