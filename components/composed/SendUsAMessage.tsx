"use client";

import styles from "./SendUsAMessage.module.scss";

import { Clock, Mail, SendHorizontal } from "lucide-react";
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
                            <span className={styles.eyebrow}>Send us a Message</span>
                            <h2>We read <em>everything.</em></h2>
                            {proposalIntent ? (
                                <p className={styles.proposalHint}>
                                    You arrived from <strong>Request a Proposal</strong>. Describe your campaign volume and goals below—we will follow up by email. Custom billing is arranged directly with our team (not through checkout).
                                </p>
                            ) : null}
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit} noValidate>
                            <div className={styles.fieldRow}>
                                <FormControl>
                                    <FormLabel htmlFor="contact-name">Name <span className={styles.required}>*</span></FormLabel>
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
                                    <FormLabel htmlFor="contact-email">Email <span className={styles.required}>*</span></FormLabel>
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
                            </div>

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
                                <FormLabel htmlFor="contact-inquiry-type">Inquiry Type <span className={styles.required}>*</span></FormLabel>
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
                                <FormLabel htmlFor="contact-message">Message <span className={styles.required}>*</span></FormLabel>
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
                                <span className={styles.responseIcon}>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_830_563)">
                                            <path d="M6.99947 12.8293C10.2201 12.8293 12.831 10.2184 12.831 6.99776C12.831 3.77711 10.2201 1.16626 6.99947 1.16626C3.77882 1.16626 1.16797 3.77711 1.16797 6.99776C1.16797 10.2184 3.77882 12.8293 6.99947 12.8293Z" stroke="#FFC400" strokeWidth="1.1663" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6.99609 3.49878V6.99768L9.32869 8.16398" stroke="#FFC400" strokeWidth="1.1663" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_830_563">
                                                <rect width="13.9956" height="13.9956" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </span>
                                <p><strong>Response Expectation:</strong> We typically respond within 1–2 business days.</p>
                            </div>

                            <Button variant="form" className={styles.submitButton} type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Message"}
                                <SendHorizontal size={18} strokeWidth={2} />
                            </Button>
                        </form>
                    </div>

                    <aside className={styles.infoColumn}>
                        <article className={styles.infoCard}>
                            <span className={styles.infoIcon}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.99906 2.99805H14.9915C15.816 2.99805 16.4906 3.67262 16.4906 4.49711V13.4915C16.4906 14.3159 15.816 14.9905 14.9915 14.9905H2.99906C2.17458 14.9905 1.5 14.3159 1.5 13.4915V4.49711C1.5 3.67262 2.17458 2.99805 2.99906 2.99805Z" stroke="#FFC400" strokeWidth="1.34915" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16.4906 4.49707L8.99529 9.74377L1.5 4.49707" stroke="#FFC400" strokeWidth="1.34915" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className={styles.infoLabel}>Email Us</span>
                            <a href="mailto:info@caribnewswire.com">info@caribnewswire.com</a>
                            <p>For all general, media, and submission inquiries.</p>
                        </article>
                    </aside>
                </div>
            </Container>
        </section>
    );
}
