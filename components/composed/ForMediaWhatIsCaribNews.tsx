import styles from "./ForMediaWhatIsCaribNews.module.scss";

import { Container } from "../layout";
import Image from "next/image";
import { SvgIcon } from "../ui";

export default function ForMediaWhatIsCaribNews() {
    return (
        <section className={styles.whatIsCaribNewsWire}>
            <Container className={styles.whatIsCaribNewsWireInner}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/what-is-carib-news-image-for-media.jpg"
                        alt="What is Carib News Image"
                        fill
                        className={styles.image}
                    />
                </div>

                <div className={styles.detailSection}>
                    <p>Carib Newswire connects journalists and media professionals across the Caribbean and diaspora with credible news, verified information, and story opportunities.</p>

                    <p>Our platform is designed to make it easier for media to access press releases, discover stories, and stay informed about developments across the region.</p>

                    <div className={styles.membershipForMedia}>
                        <SvgIcon icon="membership-for-media" />
                        <p>Membership for media professionals is free.</p>
                    </div>
                </div>
            </Container>
        </section>
    );
};