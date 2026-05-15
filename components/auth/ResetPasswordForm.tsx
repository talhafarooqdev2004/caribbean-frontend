"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import styles from "./AuthForm.module.scss";

import { Container } from "@/components/layout";
import { Button, FormControl, FormLabel, Input } from "@/components/ui";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = useMemo(() => (searchParams.get("token") || "").trim(), [searchParams]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!token) {
            setError("This page needs a valid reset link from your email.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords must match.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setError(typeof payload?.error === "string" ? payload.error : "We could not reset your password.");
                return;
            }

            setMessage(typeof payload?.message === "string" ? payload.message : "Password updated.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch {
            setError("We could not reset your password.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className={styles.authSection}>
            <Container className={styles.authInner}>
                <div className={styles.copyBlock}>
                    <h1>Choose a new password</h1>
                    <p>Use a strong password you have not used elsewhere.</p>
                </div>

                <div className={styles.card}>
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        {!token ? (
                            <p className={styles.formError}>
                                This reset link is missing or invalid.{" "}
                                <Link href="/forgot-password">Request a new link</Link>.
                            </p>
                        ) : null}

                        <FormControl>
                            <FormLabel htmlFor="reset-password">New password *</FormLabel>
                            <Input
                                id="reset-password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                disabled={!token}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="reset-confirm">Confirm password *</FormLabel>
                            <Input
                                id="reset-confirm"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                disabled={!token}
                            />
                        </FormControl>

                        {error ? <p className={styles.formError}>{error}</p> : null}
                        {message ? <p className={styles.formSuccess}>{message}</p> : null}

                        <Button
                            type="submit"
                            variant="form"
                            className={styles.submitButton}
                            disabled={isSubmitting || !token}
                        >
                            {isSubmitting ? "Updating..." : "Update password"}
                        </Button>

                        <div className={styles.formFooter}>
                            <Link href="/login">Back to sign in</Link>
                        </div>
                    </form>
                </div>
            </Container>
        </section>
    );
}
