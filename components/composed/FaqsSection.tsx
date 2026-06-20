import styles from "./FaqsSection.module.scss";

import { Container } from "../layout";
import React from "react";

export default function FaqsSection() {
    return (
        <section className={styles.faqsSection}>
            <Container className={styles.faqsSectionInner}>
                <header className={styles.sectionHeader}>
                    <span className={styles.eyebrow}>FAQ</span>
                    <h2>Common <span>questions</span></h2>
                </header>

                <Faqs>
                    <Faq
                        question="What counts as one press release?"
                        answer="One press release is a single announcement of up to 700 words with one cover image and one outbound link, distributed to our journalist network and published in the newsroom."
                    />
                    <Faq
                        question="How long are 3-Release Pack credits valid?"
                        answer="3-Release Pack credits are valid for 6 months from the date of purchase and can be used across multiple campaigns whenever you're ready."
                    />
                    <Faq
                        question="Can I add Featured Placement to a 3-Release Pack release?"
                        answer="Yes. Featured Placement is a $99 add-on that can be applied to any release — including releases from a 3-Release Pack — and is selected at checkout."
                    />
                    <Faq
                        question="How does the editorial review work?"
                        answer="Every submission is reviewed by our editorial team for clarity and style before publication, typically within 48 hours, or same day for Professional Campaigns."
                    />
                    <Faq
                        question="Do you distribute outside the Caribbean?"
                        answer="Yes. Alongside Caribbean-wide distribution, Professional Campaigns include diaspora distribution to Caribbean media in the US, UK, and Canada."
                    />
                    <Faq
                        question="How is the Professional Campaign package priced?"
                        answer="Professional Campaigns start at $999 and are tailored to your goals with a custom quote. Reach out and we'll prepare a proposal for your campaign."
                    />
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
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <span className={styles.toggle} aria-hidden="true" />
            </button>
            {isOpen && (
                <div className={styles.answer}>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};
