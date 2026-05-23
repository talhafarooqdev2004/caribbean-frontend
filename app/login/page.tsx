import LoginForm from "@/components/auth/LoginForm";
import { Container } from "@/components/layout";
import styles from "@/components/auth/AuthForm.module.scss";

/**
 * Static shell renders on the server so `/login?next=...` paints copy + form frame
 * in the same response as the layout (no header/footer-only flash during navigation).
 * `LoginForm` reads `?next=` / `?bookmark=` on the client.
 */
export const dynamic = "force-static";

export default function LoginPage() {
    return (
        <section className={styles.authSection}>
            <Container className={styles.authInner}>
                <div className={styles.copyBlock}>
                    <h1>Log in to your portal</h1>
                    <p>
                        Manage submissions, credits, saved newsroom stories, and digest preferences in one place.
                    </p>
                </div>
                <LoginForm />
            </Container>
        </section>
    );
}
