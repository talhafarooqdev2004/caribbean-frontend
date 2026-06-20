import styles from "./AuthPageShell.module.scss";

import { Container } from "../layout";

type AuthPageShellProps = React.PropsWithChildren<{
    badge: string;
    title: React.ReactNode;
    subtitle: string;
}>;

export default function AuthPageShell({ badge, title, subtitle, children }: AuthPageShellProps) {
    return (
        <div className={styles.shell}>
            <section className={styles.hero}>
                <Container className={styles.heroInner}>
                    <span className={styles.badge}>{badge}</span>
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                    <span className={styles.divider} aria-hidden="true" />
                </Container>
            </section>

            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z" />
                </svg>
            </div>

            <section className={styles.content}>
                <Container className={styles.contentInner}>{children}</Container>
            </section>
        </div>
    );
}
