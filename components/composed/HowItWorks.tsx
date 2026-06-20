import styles from "./HowItWorks.module.scss";

import { ArrowRight, FileText, PlayCircle, SquareCheck } from "lucide-react";
import { Container } from "../layout";

const steps = [
    { num: "01", step: "— STEP 1", Icon: FileText, title: "Submit Your Story", description: "Create your press release with our simple submission form. Add images, select categories, and target specific islands." },
    { num: "02", step: "— STEP 2", Icon: SquareCheck, title: "Get Approved", description: "Our editorial team reviews your submission within 48 hours to ensure accuracy, relevance, and credibility." },
    { num: "03", step: "— STEP 3", Icon: PlayCircle, title: "Reach Media", description: "Your story is distributed to our curated network of Caribbean journalists and published in our newsroom." },
];

export default function HowItWorks() {
    return (
        <section className={styles.howItWorks}>
            <Container className={styles.howItWorksInner}>
                <div className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>How It Works</span>
                        <h2>Three steps to reach</h2>
                    </div>
                    <p>
                        Simple, editorial, effective. From submission to front pages in 48 hours or less —
                        with a human review every step of the way.
                    </p>
                </div>

                <div className={styles.steps}>
                    {steps.map(({ num, step, Icon, title, description }, index) => (
                        <article key={num} className={styles.step}>
                            {index < steps.length - 1 ? (
                                <span className={styles.stepArrow}><ArrowRight size={14} strokeWidth={2} /></span>
                            ) : null}

                            <span className={styles.stepNumber}>{num}</span>
                            <span className={styles.stepIcon}><Icon size={20} strokeWidth={1.9} /></span>
                            <span className={styles.stepLabel}>{step}</span>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
};
