import styles from "./SubmitYourPressReleaseHeroSection.module.scss";

import { Container } from "../layout";

type SubmitYourPressReleaseHeroSectionProps = {
    activeStep?: number;
};

export default function SubmitYourPressReleaseHeroSection({
    activeStep = 1,
}: SubmitYourPressReleaseHeroSectionProps) {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <div className={styles.heroSectionBadge}>
                    <span className={styles.badgeDot} aria-hidden />
                    STEP {activeStep} OF 5
                </div>

                <h1>
                    Submit Your <span>Press Release</span>
                </h1>

                <p>Share your story with Caribbean media professionals across 15+ islands</p>
            </Container>
        </section>
    );
}
