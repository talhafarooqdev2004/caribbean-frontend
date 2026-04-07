"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./AdminLoginForm.module.scss";

import { Button, FormControl, FormLabel, Input } from "@/components/ui";
import { Container } from "@/components/layout";

type LoginFormValues = {
    username: string;
    password: string;
};

export default function AdminLoginForm() {
    const router = useRouter();
    const [values, setValues] = useState<LoginFormValues>({
        username: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!values.username.trim() || !values.password.trim()) {
            setError("Username and password are required.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                setError(typeof payload?.error === "string" ? payload.error : "Invalid credentials.");
                return;
            }

            router.replace("/admin");
            router.refresh();
        } catch {
            setError("We could not sign you in right now. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className={styles.adminLogin}>
            <Container className={styles.adminLoginInner}>
                <div className={styles.copyBlock}>
                    <h1>Admin login</h1>

                    <p>Use the private admin credentials to view, manage, and delete enquiries from the media signup form.</p>
                </div>

                <div className={styles.card}>
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <FormControl>
                            <FormLabel htmlFor="admin-username">Username</FormLabel>
                            <Input
                                id="admin-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder="Admin username"
                                value={values.username}
                                onChange={(event) => setValues((current) => ({ ...current, username: event.target.value }))}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="admin-password">Password</FormLabel>
                            <Input
                                id="admin-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Admin password"
                                value={values.password}
                                onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
                            />
                        </FormControl>

                        {error ? <p className={styles.error}>{error}</p> : null}

                        <Button type="submit" variant="form" className={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </div>
            </Container>
        </section>
    );
}
