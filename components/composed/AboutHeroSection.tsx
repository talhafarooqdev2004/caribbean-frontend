import styles from "./AboutHeroSection.module.scss";

import { Container } from "../layout";

const stats = [
    { value: "Growing", label: "Media Network" },
    { value: "15", suffix: "+", label: "Caribbean Markets" },
    { value: "48", suffix: "hr", label: "Editorial Turnaround" },
    { value: "Targeted", label: "Distribution" },
];

export default function AboutHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <span className={styles.badge}>About Us</span>

                <h1>
                    About Carib <span>Newswire</span>
                </h1>

                <p>
                    Building a trusted distribution layer for Caribbean news — connecting the
                    organizations that matter with the journalists who tell the stories.
                </p>

                <div className={styles.stats}>
                    {stats.map((stat) => (
                        <div key={stat.label} className={styles.stat}>
                            <span className={styles.statValue}>
                                {stat.value}
                                {stat.suffix ? (
                                    <span className={styles.statSuffix}>{stat.suffix}</span>
                                ) : null}
                            </span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
