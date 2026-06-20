"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./AuthForm.module.scss";

import AuthPageShell from "./AuthPageShell";
import { Button, FormControl, FormLabel, Input } from "@/components/ui";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = email.trim().toLowerCase();

        if (!trimmed) {
            setError("Email is required.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmed }),
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setError(typeof payload?.error === "string" ? payload.error : "Something went wrong.");
                return;
            }

            setMessage(typeof payload?.message === "string" ? payload.message : "Check your email for next steps.");
        } catch {
            setError("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthPageShell
            badge="Account"
            title={<>Reset Your <span>Password</span></>}
            subtitle="Enter the email you use for your Carib Newswire account. If we find a match, we will send a reset link."
        >
            <div className={styles.card}>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <FormControl>
                        <FormLabel htmlFor="forgot-email">
                            Email Address <span className={styles.required}>*</span>
                        </FormLabel>
                        <Input
                            id="forgot-email"
                            type="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </FormControl>

                    {error ? <p className={styles.formError}>{error}</p> : null}
                    {message ? <p className={styles.formSuccess}>{message}</p> : null}

                    <Button type="submit" variant="form" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send reset link"}
                    </Button>

                    <div className={styles.formFooter}>
                        <Link href="/login">Back to sign in</Link>
                    </div>
                </form>
            </div>
        </AuthPageShell>
    );
}
