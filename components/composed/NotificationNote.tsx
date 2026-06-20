import styles from "./NotificationNote.module.scss";

import { Container } from "../layout";

export default function NotificationNote() {
    return (
        <section className={styles.notificationNote}>
            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z" />
                </svg>
            </div>

            <Container className={styles.notificationNoteInner}>
                <span className={styles.quoteIcon}>
                    <svg width="35" height="32" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.56094 3.8147e-06C9.72094 3.8147e-06 11.5209 0.720004 12.9609 2.16C14.4009 3.52 15.1209 5.44 15.1209 7.92C15.1209 10.32 14.7609 12.56 14.0409 14.64C13.4009 16.72 12.5609 19.04 11.5209 21.6C10.5609 24.16 9.52094 27.44 8.40094 31.44H6.72094C5.68094 27.6 4.60094 24.4 3.48094 21.84C2.44094 19.28 1.60094 16.96 0.960938 14.88C0.320938 12.72 0.000937879 10.44 0.000937879 8.04C0.000937879 5.56 0.720938 3.60001 2.16094 2.16C3.60094 0.720004 5.40094 3.8147e-06 7.56094 3.8147e-06ZM26.8809 3.8147e-06C29.0409 3.8147e-06 30.8409 0.720004 32.2809 2.16C33.7209 3.52 34.4409 5.44 34.4409 7.92C34.4409 10.32 34.0809 12.56 33.3609 14.64C32.7209 16.72 31.8809 19.04 30.8409 21.6C29.8809 24.16 28.8409 27.44 27.7209 31.44H26.0409C25.0009 27.6 23.9209 24.4 22.8009 21.84C21.7609 19.28 20.9209 16.96 20.2809 14.88C19.6409 12.72 19.3209 10.44 19.3209 8.04C19.3209 5.56 20.0409 3.60001 21.4809 2.16C22.9209 0.720004 24.7209 3.8147e-06 26.8809 3.8147e-06Z" fill="#5899E2" fillOpacity="0.2" />
                    </svg>
                </span>

                <h2>
                    We are not a mass email service. We are building the{" "}
                    <em>distribution infrastructure</em> that regional media has been missing.
                </h2>

                <span className={styles.divider} aria-hidden="true" />

                <p>
                    Every feature we build, every journalist we add to our network, and every editorial
                    decision we make is guided by one principle: Caribbean stories deserve Caribbean infrastructure.
                </p>
            </Container>
        </section>
    );
};
