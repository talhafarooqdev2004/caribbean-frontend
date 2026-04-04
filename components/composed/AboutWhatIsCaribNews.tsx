import styles from "./AboutWhatIsCaribNews.module.scss";

import { Container } from "../layout";
import Image from "next/image";

export default function AboutWhatIsCaribNews() {
    return (
        <section className={styles.whatIsCaribNewsWire}>
            <Container className={styles.whatIsCaribNewsWireInner}>
                <div className={styles.detailSection}>
                    <h1>What is Carib Newswire?</h1>

                    <p>Carib Newswire is a premium press distribution platform designed specifically for the Caribbean and its global diaspora.</p>

                    <p>We help organizations share verified announcements with journalists, editors, and media professionals across the region through curated, targeted distribution.</p>
                </div>

                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/what-is-carib-news-image-about.jpg"
                        alt="What is Carib News Image"
                        fill
                        className={styles.image}
                    />
                </div>
            </Container>
        </section>
    );
};