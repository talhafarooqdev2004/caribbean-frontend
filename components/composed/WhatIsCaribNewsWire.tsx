import styles from "./WhatIsCaribNewsWire.module.scss";

import { Container } from "../layout";
import Image from "next/image";

export default function WhatIsCaribNewsWire() {
    return (
        <section className={styles.whatIsCaribNewsWire}>
            <Container className={styles.whatIsCaribNewsWireInner}>
                <div className={styles.detailSection}>
                    <h1>What is Carib Newswire?</h1>

                    <p>Carib Newswire is a premium press distribution platform designed specifically for the Caribbean and its global diaspora. We help organizations share verified announcements with journalists, editors, and media professionals across the region through curated, targeted distribution.</p>

                    <Tags>
                        <Tag>✓ Verified Submissions</Tag>
                        <Tag>✓ Curated Networks</Tag>
                        <Tag>✓ Regional Focus</Tag>
                    </Tags>
                </div>

                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/what-is-carib-news-image.jpg"
                        alt="What is Carib News Image"
                        fill
                        className={styles.image}
                    />
                </div>
            </Container>
        </section>
    );
};

function Tags({ children }: React.PropsWithChildren) {
    return <div className={styles.tags}>{children}</div>;
};

function Tag({ children }: React.PropsWithChildren) {
    return <div className={styles.tag}>{children}</div>;
};