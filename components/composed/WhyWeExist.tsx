import styles from "./WhyWeExist.module.scss";

import { Activity, Monitor, Phone } from "lucide-react";
import { Container } from "../layout";

const problems = [
    { Icon: Monitor, title: "Fragmented media landscape", description: "Dozens of islands, hundreds of outlets — each with different editors, beats, and submission norms. We've mapped it all." },
    { Icon: Phone, title: "Irrelevant global pitches", description: "Caribbean journalists are overwhelmed by off-target press releases. Ours are curated for relevance, region, and beat." },
    { Icon: Activity, title: "Credibility gap", description: "Unverified submissions damage trust. Our editorial review ensures every release meets a standard journalists rely on." },
];

export default function WhyWeExist() {
    return (
        <section className={styles.whyWeExist}>
            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
                    <path d="M0,0 H1440 V28 C1140,28 1020,56 780,42 C540,28 360,10 0,34 Z" />
                </svg>
            </div>

            <Container className={styles.whyWeExistInner}>
                <div className={styles.detailSection}>
                    <span className={styles.eyebrow}>Why we exist</span>

                    <h2>The media landscape is <em>fragmented.</em></h2>

                    <p>
                        Organizations often struggle to reach the right outlets across multiple islands,
                        while journalists are inundated with irrelevant pitches from global services that
                        don&apos;t understand the region.
                    </p>

                    <p>
                        Carib Newswire bridges that gap. We provide structured, editorially reviewed
                        distribution that prioritizes credibility, relevance, and regional visibility —
                        serving both the storytellers and the journalists who tell them.
                    </p>
                </div>

                <div className={styles.cards}>
                    {problems.map(({ Icon, title, description }) => (
                        <article key={title} className={styles.card}>
                            <span className={styles.cardIcon}>
                                <Icon size={20} strokeWidth={1.9} />
                            </span>
                            <div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
};
