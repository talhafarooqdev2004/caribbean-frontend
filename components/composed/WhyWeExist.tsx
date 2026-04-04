import styles from "./WhyWeExist.module.scss";

import { Container } from "../layout";
import Image from "next/image";

export default function WhyWeExist() {
    return (
        <section className={styles.whyWeExist}>
            <Container className={styles.whyWeExistInner}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/why-we-exist.jpeg"
                        alt="Why We exist image"
                        fill
                        className={styles.image}
                    />
                </div>

                <div className={styles.detailSection}>
                    <h1>Why We Exist</h1>

                    <p>The Caribbean media landscape is dynamic, but fragmented.</p>

                    <p>Organizations often struggle to reach the right outlets across multiple islands, while journalists are inundated with irrelevant pitches.</p>

                    <p>Carib Newswire bridges that gap. We provide structured, editorially reviewed distribution that prioritizes credibility, relevance, and regional visibility.</p>
                </div>
            </Container>
        </section>
    );
};