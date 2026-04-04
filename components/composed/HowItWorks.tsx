import styles from "./HowItWorks.module.scss";

import { Container } from "../layout";
import React from "react";
import clsx from "clsx";
import { SvgIcon } from "../ui";

export default function HowItWorks() {
    return (
        <section className={styles.howItWorks}>
            <Container className={styles.howItWorksInner}>
                <h1>How It Works</h1>

                <p>Three simple steps to reach Caribbean media professionals</p>

                <Cards>
                    <Card>
                        <Card.Icon
                            icon="note-book"
                            className={styles.iconStep1}
                        />
                        <Card.Tag className={styles.tagStep1}>Step 1</Card.Tag>
                        <Card.Title>Submit Your Story</Card.Title>
                        <Card.Description>Create your press release with our simple submission form. Add images, select categories, and target specific islands.</Card.Description>
                    </Card>

                    <Card>
                        <Card.Icon
                            icon="approve"
                            className={styles.iconStep2}
                        />
                        <Card.Tag className={styles.tagStep2}>Step 2</Card.Tag>
                        <Card.Title>Get Approved</Card.Title>
                        <Card.Description>Our editorial team reviews your submission within 48 hours to ensure accuracy, relevance, and credibility.</Card.Description>
                    </Card>

                    <Card>
                        <Card.Icon
                            icon="media"
                            className={styles.iconStep3}
                        />
                        <Card.Tag className={styles.tagStep3}>Step 3</Card.Tag>
                        <Card.Title>Reach Media</Card.Title>
                        <Card.Description>Your story is distributed to our curated network of Caribbean journalists and published in our newsroom.</Card.Description>
                    </Card>
                </Cards>
            </Container>
        </section>
    );
};

const Cards = function HowItWorksCards({ children }: React.PropsWithChildren) {
    return <div className={styles.cards}>{children}</div>;
};

const Card = function HowItWorksCard({ children }: React.PropsWithChildren) {
    return <div className={styles.card}>{children}</div>;
}

Card.Icon = function CardIcon({ icon, className }: { icon: "note-book" | "approve" | "media", className: string }) {
    return (
        <div className={clsx(styles.icon, className)}>
            <SvgIcon icon={icon} />
        </div>
    );
};

Card.Tag = function CardTag({ className, children }: React.PropsWithChildren<{ className: string }>) {
    return <div className={clsx(styles.tag, className)}>{children}</div>
};

Card.Title = function CardTitle({ children }: React.PropsWithChildren) {
    return <h2 className={styles.title}>{children}</h2>;
};

Card.Description = function CardDescription({ children }: React.PropsWithChildren) {
    return <p className={styles.description}>{children}</p>;
};