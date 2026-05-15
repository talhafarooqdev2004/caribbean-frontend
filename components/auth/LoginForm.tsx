"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

import styles from "./AuthForm.module.scss";

import { Container } from "@/components/layout";
import { Button, FormControl, FormLabel, Input } from "@/components/ui";
import { armJoinMediaNetworkFormIntent, joinMediaNetworkFormHref } from "@/lib/join-media-network-form-intent";

/** Common typos that still “look” right but won’t match the registered email. */
function getEmailTypoHint(email: string): string | null {
    const trimmed = email.trim().toLowerCase();
    if (/@gamil\.com$/i.test(trimmed)) {
        return "This address ends in “gamil.com”. If you meant Gmail, use @gmail.com instead.";
    }
    if (/@gmial\.com$/i.test(trimmed)) {
        return "This address ends in “gmial.com”. If you meant Gmail, use @gmail.com instead.";
    }
    if (/@gmail\.co$/i.test(trimmed)) {
        return "Did you mean @gmail.com?";
    }
    if (/@yahooo\.com$/i.test(trimmed)) {
        return "Did you mean @yahoo.com?";
    }
    if (/@hotmial\.com$/i.test(trimmed)) {
        return "Did you mean @hotmail.com?";
    }
    return null;
}

/** Only allow same-site relative paths (blocks `//evil.com` open redirects). */
function safeNextPath(raw: string | null | undefined): string | null {
    const t = raw?.trim();
    if (!t) {
        return null;
    }
    if (!t.startsWith("/") || t.startsWith("//")) {
        return null;
    }
    return t;
}

type LoginFormProps = {
    /** Optional overrides (e.g. tests). Normally `?next=` / `?bookmark=` are read from the URL on the client. */
    redirectTo?: string;
    bookmarkReleaseId?: string;
};

export default function LoginForm({ redirectTo: redirectToProp, bookmarkReleaseId: bookmarkReleaseIdProp }: LoginFormProps = {}) {
    const router = useRouter();
    const [redirectTo, setRedirectTo] = useState(() => redirectToProp?.trim() || "/portal");
    const [bookmarkReleaseId, setBookmarkReleaseId] = useState<string | null>(() => bookmarkReleaseIdProp?.trim() || null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [emailTypoHint, setEmailTypoHint] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useLayoutEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const next = safeNextPath(params.get("next"));
        if (next) {
            setRedirectTo(next);
        }
        const bookmark = params.get("bookmark")?.trim();
        if (bookmark) {
            setBookmarkReleaseId(bookmark);
        }
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email.trim() || !password) {
            setError("Email and password are required.");
            setEmailTypoHint(null);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setEmailTypoHint(null);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                const normalizedEmail = email.trim().toLowerCase();
                setError(typeof payload?.error === "string" ? payload.error : "Invalid email or password.");
                setEmailTypoHint(getEmailTypoHint(normalizedEmail));
                return;
            }

            if (typeof payload?.token === "string") {
                window.localStorage.setItem("carib_token", payload.token);
                window.localStorage.setItem("caribbean_news_submitter_token", payload.token);
            }

            if (payload?.user) {
                window.localStorage.setItem("carib_user", JSON.stringify(payload.user));
            } else {
                window.localStorage.setItem("carib_user", JSON.stringify({
                    firstName: email.trim().split("@")[0],
                    email: email.trim().toLowerCase(),
                }));
            }

            if (bookmarkReleaseId?.trim()) {
                await fetch("/api/user/bookmarks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ releaseId: bookmarkReleaseId.trim() }),
                }).catch(() => null);
            }

            router.push(redirectTo);
            router.refresh();
        } catch {
            setError("Invalid email or password.");
            setEmailTypoHint(getEmailTypoHint(email.trim().toLowerCase()));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className={styles.authSection}>
            <Container className={styles.authInner}>
                <div className={styles.copyBlock}>
                    <h1>Log in to your portal</h1>
                    <p>
                        Manage submissions, credits, saved newsroom stories, and digest preferences in one place.
                    </p>
                </div>

                <div className={styles.card}>
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <FormControl>
                            <FormLabel htmlFor="login-email">Email Address *</FormLabel>
                            <Input
                                id="login-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setEmailTypoHint(null);
                                    setError(null);
                                }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="login-password">Password *</FormLabel>
                            <Input
                                id="login-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError(null);
                                }}
                            />
                        </FormControl>

                        <div className={styles.forgotRow}>
                            <Link href="/forgot-password">Forgot password?</Link>
                        </div>

                        {error ? (
                            <div role="alert">
                                <p className={styles.formError}>{error}</p>
                                {emailTypoHint ? <p className={styles.emailTypoHintInline}>{emailTypoHint}</p> : null}
                            </div>
                        ) : null}

                        <Button type="submit" variant="form" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        <div className={styles.formFooter}>
                            <span>Don&apos;t have an account?</span>
                            <Link href={joinMediaNetworkFormHref()} onClick={() => armJoinMediaNetworkFormIntent()}>
                                Join the network
                            </Link>
                        </div>
                    </form>
                </div>
            </Container>
        </section>
    );
}
