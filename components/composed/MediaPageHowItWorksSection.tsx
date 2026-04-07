import styles from "./MediaPageHowItWorksSection.module.scss";

import { Container } from "../layout";
import { HowItWorksCards, HowItWorksCard } from "./HowItWorksCards";

export default function MediaPageHowItWorksSection() {
    return (
        <section className={styles.mediaHowItWorks}>
            <Container className={styles.mediaHowItWorksInner}>
                <h1>How Carib Newswire Works</h1>

                <p>Three simple steps to reach Caribbean media professionals</p>

                <HowItWorksCards>
                    <HowItWorksCard type="media-signup">
                        <HowItWorksCard.Icon
                            icon="note-book"
                            className={styles.iconStep1}
                        />
                        <HowItWorksCard.Tag className={styles.tagStep1}>Step 1</HowItWorksCard.Tag>
                        <HowItWorksCard.Title>Submit Your Story</HowItWorksCard.Title>
                        <HowItWorksCard.Description>Create your press release with our simple submission form. Add images, select categories, and target specific islands.</HowItWorksCard.Description>
                    </HowItWorksCard>

                    <HowItWorksCard type="media-signup">
                        <HowItWorksCard.Icon
                            icon="approve"
                            className={styles.iconStep2}
                        />
                        <HowItWorksCard.Tag className={styles.tagStep2}>Step 2</HowItWorksCard.Tag>
                        <HowItWorksCard.Title>Get Approved</HowItWorksCard.Title>
                        <HowItWorksCard.Description>Our editorial team reviews your submission within 48 hours to ensure accuracy, relevance, and credibility.</HowItWorksCard.Description>
                    </HowItWorksCard>

                    <HowItWorksCard type="media-signup">
                        <HowItWorksCard.Icon
                            icon="media"
                            className={styles.iconStep3}
                        />
                        <HowItWorksCard.Tag className={styles.tagStep3}>Step 3</HowItWorksCard.Tag>
                        <HowItWorksCard.Title>Reach Media</HowItWorksCard.Title>
                        <HowItWorksCard.Description>Your story is distributed to our curated network of Caribbean journalists and published in our newsroom.</HowItWorksCard.Description>
                    </HowItWorksCard>
                </HowItWorksCards>
            </Container>
        </section>
    );
}
