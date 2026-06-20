import styles from "./Testimonials.module.scss";

import { Quote, Star } from "lucide-react";
import { clsx } from "clsx";
import { Container } from "../layout";

const testimonials = [
    {
        quote: "Carib Newswire placed our announcement in front of the right editors within 24 hours. The coverage we got was exactly what we needed to launch in the region.",
        initials: "MT",
        name: "Marcus Thompson",
        role: "CEO, Caribbean Ventures Ltd.",
        tone: styles.toneBlue,
    },
    {
        quote: "As a journalist, Carib Newswire is my go-to source for credible, vetted press releases from across the islands. The editorial quality is second to none.",
        initials: "SL",
        name: "Sophia Laurent",
        role: "Senior Reporter, Trinidad Express",
        tone: styles.tonePink,
    },
    {
        quote: "We've tried other platforms but nothing compares to the regional reach and personal touch of Carib Newswire. Our NGO's work finally gets the visibility it deserves.",
        initials: "AJ",
        name: "Amara Joseph",
        role: "Director, Green Caribbean Alliance",
        tone: styles.toneGold,
    },
];

export default function Testimonials() {
    return (
        <section className={styles.testimonials}>
            <Container className={styles.testimonialsInner}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}>What people are saying</span>
                    <h2>Trusted by <em>Professionals.</em></h2>
                </header>

                <div className={styles.cards}>
                    {testimonials.map((item) => (
                        <article key={item.name} className={styles.card}>
                            <div className={styles.cardTop}>
                                <span className={styles.quoteIcon}>
                                    <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.04063 0C6.48063 0 7.68063 0.48 8.64063 1.44C9.60063 2.34667 10.0806 3.62666 10.0806 5.28C10.0806 6.88 9.84063 8.37333 9.36063 9.76C8.93396 11.1467 8.37396 12.6933 7.68063 14.4C7.04063 16.1067 6.34729 18.2933 5.60063 20.96H4.48063C3.78729 18.4 3.06729 16.2667 2.32063 14.56C1.62729 12.8533 1.06729 11.3067 0.640625 9.92C0.213959 8.48 0.000625253 6.96 0.000625253 5.36C0.000625253 3.70667 0.480625 2.4 1.44063 1.44C2.40063 0.48 3.60063 0 5.04063 0ZM17.9206 0C19.3606 0 20.5606 0.48 21.5206 1.44C22.4806 2.34667 22.9606 3.62666 22.9606 5.28C22.9606 6.88 22.7206 8.37333 22.2406 9.76C21.814 11.1467 21.254 12.6933 20.5606 14.4C19.9206 16.1067 19.2273 18.2933 18.4806 20.96H17.3606C16.6673 18.4 15.9473 16.2667 15.2006 14.56C14.5073 12.8533 13.9473 11.3067 13.5206 9.92C13.094 8.48 12.8806 6.96 12.8806 5.36C12.8806 3.70667 13.3606 2.4 14.3206 1.44C15.2806 0.48 16.4806 0 17.9206 0Z" fill="#5899E2" />
                                    </svg>
                                </span>
                                <span className={styles.stars}>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star key={index} size={14} strokeWidth={0} fill="#C4922A" />
                                    ))}
                                </span>
                            </div>

                            <p className={styles.quote}>{item.quote}</p>

                            <div className={styles.author}>
                                <span className={clsx(styles.avatar, item.tone)}>{item.initials}</span>
                                <div>
                                    <span className={styles.authorName}>{item.name}</span>
                                    <span className={styles.authorRole}>{item.role}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
};
