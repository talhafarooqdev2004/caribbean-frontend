import styles from "./WhatIsCaribNewsWire.module.scss";

import CaribbeanCoverageMap from "./CaribbeanCoverageMap";
import { Newspaper, SatelliteDish } from "lucide-react";
import { Container } from "../layout";

const pills = ["Verified Submissions", "Curated Networks", "Regional Focus"];

export default function WhatIsCaribNewsWire() {
    return (
        <section className={styles.whatIsCaribNewsWire}>
            <Container className={styles.whatIsCaribNewsWireInner}>
                <div className={styles.detailSection}>
                    <span className={styles.eyebrow}>What is Carib Newswire?</span>

                    <h2>Built for regional <em>visibility</em></h2>

                    <p>
                        Carib Newswire is a premium press distribution platform designed specifically for
                        the Caribbean and its global diaspora. We help organizations share verified
                        announcements with journalists, editors, and media professionals across the region
                        through curated, targeted distribution.
                    </p>

                    <div className={styles.tags}>
                        {pills.map((pill) => (
                            <span key={pill} className={styles.tag}>{pill}</span>
                        ))}
                    </div>
                </div>

                <div className={styles.coverageCard}>
                    <CaribbeanCoverageMap />

                    <div className={`${styles.floatingCard} ${styles.floatingTop}`}>
                        <span className={styles.floatingIcon}>
                            <Newspaper size={16} strokeWidth={1.75} />
                        </span>
                        <div className={styles.floatingCopy}>
                            <span className={styles.floatingValue}>500+</span>
                            <span className={styles.floatingLabel}>Media contacts</span>
                        </div>
                    </div>

                    <div className={`${styles.floatingCard} ${styles.floatingBottom}`}>
                        <span className={styles.floatingIcon}>
                            <SatelliteDish size={16} strokeWidth={1.75} />
                        </span>
                        <div className={styles.floatingCopy}>
                            <span className={styles.floatingValue}>15+</span>
                            <span className={styles.floatingLabel}>Islands covered</span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
