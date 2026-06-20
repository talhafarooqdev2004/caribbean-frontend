import styles from "./AboutWhatIsCaribNews.module.scss";

import { Clock, MapPin, ShieldCheck } from "lucide-react";
import { Container } from "../layout";

const features = [
    { Icon: ShieldCheck, title: "Editorially reviewed", description: "Every submission passes through our editorial team before distribution — ensuring relevance and credibility." },
    { Icon: Clock, title: "48-hour turnaround", description: "From submission to publication in as little as 48 hours, with priority tracks available." },
    { Icon: MapPin, title: "Island-level targeting", description: "Reach specific islands, categories, and journalist beats — not a generic blast list." },
];

const coverage = [
    { label: "Business", value: 88 },
    { label: "Government", value: 74 },
    { label: "Technology", value: 65 },
    { label: "Culture & Arts", value: 57 },
    { label: "Health & Science", value: 42 },
];

export default function AboutWhatIsCaribNews() {
    return (
        <section className={styles.whatIsCaribNewsWire}>
            <Container className={styles.whatIsCaribNewsWireInner}>
                <div className={styles.detailSection}>
                    <span className={styles.eyebrow}>What is Carib Newswire?</span>

                    <h2>A platform built for <em>Caribbean voices.</em></h2>

                    <p>
                        Carib Newswire is a premium press distribution platform connecting organizations
                        with media professionals across island markets and diaspora communities.
                    </p>

                    <div className={styles.features}>
                        {features.map(({ Icon, title, description }) => (
                            <div key={title} className={styles.feature}>
                                <span className={styles.featureIcon}>
                                    <Icon size={18} strokeWidth={1.9} />
                                </span>
                                <div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.coverageCard}>
                    <span className={styles.coverageEyebrow}>Coverage by category</span>

                    <ul className={styles.coverageList}>
                        {coverage.map((item) => (
                            <li key={item.label} className={styles.coverageRow}>
                                <span className={styles.coverageLabel}>{item.label}</span>
                                <span className={styles.coverageTrack}>
                                    <span className={styles.coverageFill} style={{ width: `${item.value}%` }} />
                                </span>
                                <span className={styles.coverageValue}>{item.value}%</span>
                            </li>
                        ))}
                    </ul>

                    <blockquote className={styles.coverageQuote}>
                        “We built Carib Newswire because Caribbean stories deserve Caribbean infrastructure.”
                    </blockquote>

                    <div className={styles.floatingBadge}>
                        <span className={styles.floatingIcon}>
                            🌊
                        </span>
                        <div className={styles.floatingCopy}>
                            <span className={styles.floatingValue}>15<span>+</span></span>
                            <span className={styles.floatingLabel}>Islands covered</span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
