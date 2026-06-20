"use client";

import styles from "./ReadyToShareYourNews.module.scss";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "../layout";
import { Button } from "../ui";
import Link from "next/link";
import { formatApiValidationErrors } from "@/lib/format-api-validation-errors";

const avatars = [
    { initials: "A", tone: "#345580" },
    { initials: "S", tone: "#1A8A6A" },
    { initials: "M", tone: "#8A3D1A" },
    { initials: "R", tone: "#4A2A8A" },
];

export default function ReadyToShareYourNews() {
    const [email, setEmail] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    async function handleSubscribe(event: React.FormEvent) {
        event.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            return;
        }

        setIsSubmitting(true);
        setStatusMessage(null);
        setIsError(false);

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmedEmail }),
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setIsError(true);
                setStatusMessage(formatApiValidationErrors(payload, "We could not subscribe you right now."));
                return;
            }

            const message = typeof payload?.message === "string"
                ? payload.message
                : "You are subscribed to the news digest.";
            const alreadySubscribed = payload?.data?.status === "already_subscribed";

            setSubscribed(true);
            setIsError(alreadySubscribed);
            setStatusMessage(message);
            setEmail("");
        } catch {
            setIsError(true);
            setStatusMessage("We could not subscribe you right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="newsletter" className={styles.newsletter}>
            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
                    <path d="M0,0 H1440 V28 C1140,28 1020,56 780,42 C540,28 360,10 0,34 Z" />
                </svg>
            </div>

            <Container className={styles.newsletterInner}>
                <div className={styles.copy}>
                    <span className={styles.eyebrow}>Stay informed</span>
                    <h2>
                        Caribbean news,
                        <span>delivered weekly.</span>
                    </h2>
                    <p>
                        Get the most important press releases and stories from across the Caribbean straight
                        to your inbox every Thursday morning.
                    </p>
                </div>

                <div className={styles.signup}>
                    <form className={styles.form} onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            aria-label="Email address"
                            disabled={isSubmitting}
                            required
                        />
                        <Button type="submit" className={styles.subscribeButton} disabled={isSubmitting}>
                            {subscribed ? "Subscribed" : isSubmitting ? "Subscribing..." : "Subscribe"}
                            <ArrowRight size={16} strokeWidth={2} />
                        </Button>
                    </form>

                    {statusMessage ? (
                        <p
                            className={`${styles.statusMessage} ${isError ? styles.statusMessageInfo : styles.statusMessageSuccess}`}
                            role="status"
                            aria-live="polite"
                        >
                            {statusMessage}
                        </p>
                    ) : null}

                    <p className={styles.disclaimer}>
                        No spam, unsubscribe anytime. Read our <Link href="/privacy-policy">Privacy Policy</Link>.
                    </p>

                    <div className={styles.social}>
                        <span className={styles.avatars}>
                            {avatars.map((avatar) => (
                                <span key={avatar.initials} className={styles.avatar} style={{ backgroundColor: avatar.tone }}>
                                    {avatar.initials}
                                </span>
                            ))}
                        </span>
                        <span className={styles.socialLabel}>Join 2,400+ Caribbean professionals</span>
                    </div>
                </div>
            </Container>
        </section>
    );
}
