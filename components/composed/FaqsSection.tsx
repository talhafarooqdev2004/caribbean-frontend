import styles from "./FaqsSection.module.scss";

import { Container } from "../layout";
import React from "react";
import { SvgIcon } from "../ui";

export default function FaqsSection() {
    return (
        <section className={styles.faqsSection}>
            <Container className={styles.faqsSectionInner}>
                <h1>Frequently Asked Questions</h1>

                <Faqs>
                    <Faq question="How quickly will my release be published?" answer="Most press releases are published within 24-48 hours of submission. During peak times, it may take up to 72 hours." />
                    <Faq question="Do you guarantee media pickups?" answer="We don't guarantee pickups, but our experienced team works to maximize your release's visibility to relevant media outlets." />
                    <Faq question="Can I schedule my release for a specific date?" answer="Yes, you can schedule your release to go out on a specific date. This is useful for coordinating announcements with product launches." />
                    <Faq question="Do credits expire?" answer="No, your credits do not expire. You can use them anytime, giving you flexibility in managing your PR campaigns." />
                </Faqs>
            </Container>
        </section>
    );
};

function Faqs({ children }: React.PropsWithChildren) {
    return <div className={styles.faqs}>{children}</div>;
};

function Faq({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className={`${styles.faq} ${isOpen ? styles.open : ''}`}>
            <button
                className={styles.question}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span>{question}</span>
                <SvgIcon icon="down-arrow" />
            </button>
            {isOpen && (
                <div className={styles.answer}>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};