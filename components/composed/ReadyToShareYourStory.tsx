import styles from "./ReadyToShareYourStory.module.scss";

import { Container } from "../layout";
import { Button } from "../ui";

export default function ReadyToShareYourStory() {
    return (
        <section className={styles.footerCTA}>
            <Container className={styles.footerCTAInner}>
                <h1>Ready to Share Your Story?</h1>

                <p>Position your news where Caribbean media professionals are already looking.</p>

                <div className={styles.ctaBtns}>
                    <Button className={styles.pressReleaseBtn}>Submit Your Press Release</Button>
                    <Button
                        variant="outline"
                        className={styles.viewPricingBtn}
                    >
                        View Campaign Options
                    </Button>
                </div>
            </Container>
        </section>
    );
}