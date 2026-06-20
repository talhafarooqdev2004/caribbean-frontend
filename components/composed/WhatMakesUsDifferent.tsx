import styles from "./WhatMakesUsDifferent.module.scss";

import { LayoutGrid, MapPin, ShieldCheck, Users } from "lucide-react";
import { Container } from "../layout";

const cards = [
    { num: "01", Icon: ShieldCheck, title: "Verified Submissions", description: "Every press release is reviewed by our editorial team before it reaches a single journalist — ensuring accuracy, credibility, and regional relevance." },
    { num: "02", Icon: MapPin, title: "Island & Category Alignment", description: "Target specific islands, journalist beats, and publication categories. Your Barbados real estate story won't land in a Trinidadian tech newsletter." },
    { num: "03", Icon: Users, title: "Curated Journalist Networks", description: "Our journalist database is hand-curated and continuously maintained — real editors at real publications who actually want your story." },
    { num: "04", Icon: LayoutGrid, title: "Campaign-Based Distribution", description: "Schedule and coordinate multi-release campaigns — ideal for government comms, product launches, and ongoing PR mandates across the region." },
];

export default function WhatMakesUsDifferent() {
    return (
        <section className={styles.whatMakesUsDifferent}>
            <Container className={styles.whatMakesUsDifferentInner}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}>What makes us different</span>
                    <h2>Purpose-built for <em>this region.</em></h2>
                    <p>
                        Unlike global distribution platforms that treat the Caribbean as an afterthought,
                        we are purpose-built for this region — every feature, every network, every decision.
                    </p>
                </header>

                <div className={styles.cards}>
                    {cards.map(({ num, Icon, title, description }) => (
                        <article key={num} className={styles.card}>
                            <span className={styles.cardNumber}>{num}</span>
                            <span className={styles.cardIcon}>
                                <Icon size={20} strokeWidth={1.9} />
                            </span>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
};
