import styles from "./WhoShouldJoin.module.scss";

import { clsx } from "clsx";
import { Container } from "../layout";

const roles = [
    "Journalists & reporters",
    "Editors & producers",
    "Radio & TV hosts",
    "Podcasters & creators",
    "Bloggers & writers",
    "News organizations",
];

const beats = [
    { label: "Business & Finance", value: 82, tone: "gold" },
    { label: "Government & Politics", value: 71, tone: "blue" },
    { label: "Culture & Arts", value: 65, tone: "gold" },
    { label: "Technology", value: 54, tone: "navy" },
    { label: "Environment", value: 43, tone: "blue" },
];

export default function WhoShouldJoin() {
    return (
        <section className={styles.whoShouldJoin}>
            <Container className={styles.whoShouldJoinInner}>
                <div className={styles.grid}>
                    <div>
                        <header className={styles.header}>
                            <span className={styles.eyebrow}>Who should join?</span>
                            <h2>Built for every<br />Caribbean <em>media voice.</em></h2>
                            <p>
                                Carib Newswire is designed for media professionals who cover Caribbean news and
                                communities — whether you&apos;re on-island or in the diaspora.
                            </p>
                        </header>

                        <div className={styles.leftColumn}>
                            <div className={styles.roles}>
                                {roles.map((role) => (
                                    <span key={role} className={styles.role}>{role}</span>
                                ))}
                            </div>

                            <div className={styles.builtForYou}>
                                <p>
                                    If you report on Caribbean issues or Caribbean people,{" "}
                                    <strong>Carib Newswire is built for you.</strong>
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className={styles.beatsCard}>
                        <span className={styles.beatsEyebrow}>Members by beat</span>

                        <ul className={styles.beats}>
                            {beats.map((beat) => (
                                <li key={beat.label} className={styles.beat}>
                                    <span className={styles.beatLabel}>{beat.label}</span>
                                    <span className={styles.beatTrack}>
                                        <span
                                            className={clsx(
                                                styles.beatFill,
                                                beat.tone === "gold" && styles.fillGold,
                                                beat.tone === "blue" && styles.fillBlue,
                                                beat.tone === "navy" && styles.fillNavy,
                                            )}
                                            style={{ width: `${beat.value}%` }}
                                        />
                                    </span>
                                    <span className={styles.beatValue}>{beat.value}%</span>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.divider}></div>

                        <blockquote className={styles.quote}>
                            “Having all Caribbean press releases in one place saves me hours every week.”
                            <cite> — Media member, Trinidad</cite>
                        </blockquote>
                    </div>
                </div>
            </Container>
        </section>
    );
};
