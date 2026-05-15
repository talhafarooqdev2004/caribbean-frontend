"use client";

import styles from "./SendUsAMessage.module.scss";

import { Mail, MessageCircleMore, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
} from "@/components/ui";

type SendUsAMessageProps = {
    /** When true (e.g. from Pricing “Request a Proposal”), tags the submission for admins and pre-fills context. */
    proposalIntent?: boolean;
};

type ContactFormValues = {
    name: string;
    email: string;
    organization: string;
    inquiryType: string;
    message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const inquiryTypeOptions = [
    { value: "", label: "Select inquiry type" },
    { value: "general", label: "General Inquiry" },
    { value: "press-release", label: "Press Release Distribution" },
    { value: "media-partnership", label: "Media Partnership" },
    { value: "support", label: "Support" },
    { value: "billing", label: "Billing" },
] as const;

const initialValues: ContactFormValues = {
    name: "",
    email: "",
    organization: "",
    inquiryType: "",
    message: "",
};

function buildInitialFormValues(proposalIntent: boolean): ContactFormValues {
    return {
        ...initialValues,
        inquiryType: proposalIntent ? "press-release" : "",
        message: proposalIntent
            ? "I am interested in a custom / high-volume press release package. Please share a proposal (estimated volume, timeline, and pricing)."
            : "",
    };
}

function normalizeText(value: string) {
    return value.trim().replace(/\s+/g, " ");
}

function validateContactForm(values: ContactFormValues) {
    const normalizedValues: ContactFormValues = {
        name: normalizeText(values.name),
        email: normalizeText(values.email).toLowerCase(),
        organization: normalizeText(values.organization),
        inquiryType: normalizeText(values.inquiryType),
        message: values.message.trim(),
    };

    const errors: ContactFormErrors = {};

    if (!normalizedValues.name) {
        errors.name = "Name is required.";
    }

    if (!normalizedValues.email) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValues.email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!normalizedValues.inquiryType) {
        errors.inquiryType = "Inquiry type is required.";
    }

    if (!normalizedValues.message) {
        errors.message = "Message is required.";
    }

    return {
        values: Object.keys(errors).length > 0 ? null : normalizedValues,
        errors,
    };
}

export default function SendUsAMessage({ proposalIntent = false }: SendUsAMessageProps) {
    const [formValues, setFormValues] = useState<ContactFormValues>(() => buildInitialFormValues(proposalIntent));
    const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
    const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeoutId = window.setTimeout(() => setToast(null), 5500);

        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    function updateField<K extends keyof ContactFormValues>(field: K, value: string) {
        setFormValues((current) => ({
            ...current,
            [field]: value,
        }));

        setFieldErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const nextErrors = { ...current };
            delete nextErrors[field];
            return nextErrors;
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validation = validateContactForm(formValues);

        if (!validation.values) {
            setFieldErrors(validation.errors);
            setToast(null);
            return;
        }

        setFieldErrors({});
        setIsSubmitting(true);
        setToast(null);

        try {
            const response = await fetch("/api/contact-messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...validation.values,
                    entrySource: proposalIntent ? "pricing_proposal" : "general",
                }),
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setToast({
                    tone: "error",
                    message: typeof payload?.error === "string" ? payload.error : "We could not submit your message.",
                });
                return;
            }

            setFormValues(buildInitialFormValues(proposalIntent));
            setToast({ tone: "success", message: "Your message was sent successfully." });
        } catch {
            setToast({ tone: "error", message: "We could not submit your message right now. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="contact-us-form" className={styles.contactUsPage}>
            {toast ? (
                <div
                    className={`${styles.contactToast} ${toast.tone === "success" ? styles.contactToastSuccess : styles.contactToastError}`}
                    role="status"
                    aria-live="polite"
                >
                    {toast.message}
                </div>
            ) : null}

            <Container className={styles.contactUsInner}>
                <div className={styles.contentGrid}>
                    <div className={styles.formPanel}>
                        <div className={styles.panelHeader}>
                            <MessageCircleMore size={24} strokeWidth={1.9} />
                            <h1>Send us a Message</h1>
                            {proposalIntent ? (
                                <p className={styles.proposalHint}>
                                    You arrived from <strong>Request a Proposal</strong>. Describe your campaign volume and goals below—we will follow up by email. Custom billing is arranged directly with our team (not through checkout).
                                </p>
                            ) : null}
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit} noValidate>
                            <FormControl>
                                <FormLabel htmlFor="contact-name">Name *</FormLabel>
                                <Input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    placeholder="Your full name"
                                    autoComplete="name"
                                    value={formValues.name}
                                    onChange={(event) => updateField("name", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.name)}
                                />
                                {fieldErrors.name ? <p className={styles.fieldError}>{fieldErrors.name}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="contact-email">Email *</FormLabel>
                                <Input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    autoComplete="email"
                                    value={formValues.email}
                                    onChange={(event) => updateField("email", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.email)}
                                />
                                {fieldErrors.email ? <p className={styles.fieldError}>{fieldErrors.email}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="contact-organization">
                                    Organization <span className={styles.optional}>(optional)</span>
                                </FormLabel>
                                <Input
                                    id="contact-organization"
                                    name="organization"
                                    type="text"
                                    placeholder="Your company or organization"
                                    autoComplete="organization"
                                    value={formValues.organization}
                                    onChange={(event) => updateField("organization", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.organization)}
                                />
                                {fieldErrors.organization ? <p className={styles.fieldError}>{fieldErrors.organization}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="contact-inquiry-type">Inquiry Type *</FormLabel>
                                <Select
                                    id="contact-inquiry-type"
                                    name="inquiryType"
                                    options={inquiryTypeOptions}
                                    value={formValues.inquiryType}
                                    onChange={(event) => updateField("inquiryType", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.inquiryType)}
                                />
                                {fieldErrors.inquiryType ? <p className={styles.fieldError}>{fieldErrors.inquiryType}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="contact-message">Message *</FormLabel>
                                <Textarea
                                    id="contact-message"
                                    name="message"
                                    placeholder="Tell us how we can help..."
                                    rows={7}
                                    value={formValues.message}
                                    onChange={(event) => updateField("message", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.message)}
                                />
                                {fieldErrors.message ? <p className={styles.fieldError}>{fieldErrors.message}</p> : null}
                            </FormControl>

                            <div className={styles.responseCard}>
                                <strong>Response Expectation:</strong> We typically respond within 1-2 business days.
                            </div>

                            <Button variant="form" className={styles.submitButton} type="submit" disabled={isSubmitting}>
                                <SendHorizontal size={18} strokeWidth={2} />
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </div>

                    <aside className={styles.infoColumn}>
                        <article className={`${styles.infoCard} ${styles.infoCardHighlighted}`}>
                            <div className={styles.infoHeader}>
                                <Mail size={22} strokeWidth={1.9} />
                                <h2>Email Us</h2>
                            </div>
                            <a href="mailto:info@caribnewswire.com">info@caribnewswire.com</a>
                        </article>

                        <article className={styles.infoCard}>
                            <h2>Business Hours</h2>
                            <p>Monday - Friday</p>
                            <strong>9:00 AM - 5:00 PM AST</strong>
                        </article>

                        <article className={styles.infoCard}>
                            <h2>Address</h2>
                            <address>
                                Bayfront Innovation Group LLC
                                <br />
                                P.O. Box 2327
                                <br />
                                Kingshill, VI 00851-2327
                                <br />
                                St. Croix, USVI
                            </address>
                        </article>
                    </aside>
                </div>
            </Container>
        </section>
    );
}
