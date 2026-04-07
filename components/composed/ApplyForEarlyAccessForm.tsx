"use client";

import { useEffect, useState } from "react";

import styles from "./ApplyForEarlyAccess.module.scss";

import { validateEnquiryInput, type EnquiryErrors } from "@/lib/enquiry-validation";
import { initialEnquiryValues, roleOptions, territoryOptions, type EnquiryFormValues } from "@/lib/enquiry-options";

import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    SvgIcon,
} from "../ui";
import { Container } from "@/components/layout";

type ToastState = {
    tone: "success" | "error";
    message: string;
};

const fieldIds = {
    firstName: "media-signup-first-name",
    lastName: "media-signup-last-name",
    email: "media-signup-email",
    publicationName: "media-signup-publication",
    role: "media-signup-role",
    coverageArea: "media-signup-coverage",
    region: "media-signup-region",
    website: "media-signup-website",
    notes: "media-signup-notes",
} as const;

function buildFieldOptions() {
    return [
        { value: "", label: "Select your role" },
        ...roleOptions,
    ];
}

function buildRegionOptions() {
    return [
        { value: "", label: "Select your region" },
        ...territoryOptions,
    ];
}

export default function ApplyForEarlyAccess() {
    const [formValues, setFormValues] = useState<EnquiryFormValues>(initialEnquiryValues);
    const [fieldErrors, setFieldErrors] = useState<EnquiryErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeoutId = window.setTimeout(() => setToast(null), 4000);

        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    function updateField<K extends keyof EnquiryFormValues>(field: K, value: string) {
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

        const validation = validateEnquiryInput(formValues);

        if (!validation.values) {
            setFieldErrors(validation.errors);
            setToast({
                tone: "error",
                message: "Please review the highlighted fields and try again.",
            });
            return;
        }

        setIsSubmitting(true);
        setFieldErrors({});

        try {
            const response = await fetch("/api/submit-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...validation.values,
                    requestId: submissionId,
                }),
            });

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                const message = typeof payload?.error === "string"
                    ? payload.error
                    : "We could not submit your application right now. Please try again.";

                setToast({
                    tone: "error",
                    message,
                });
                return;
            }

            setFormValues(initialEnquiryValues);
            setSubmissionId(crypto.randomUUID());
            setToast({
                tone: "success",
                message: "Your application was submitted successfully. We will be in touch soon.",
            });
        } catch {
            setToast({
                tone: "error",
                message: "We could not submit your application right now. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="apply-for-early-access" className={styles.applyForEarlyAccess}>
            {toast ? (
                <div
                    className={`${styles.toast} ${toast.tone === "success" ? styles.toastSuccess : styles.toastError}`}
                    role="status"
                    aria-live="polite"
                >
                    <span>{toast.message}</span>
                </div>
            ) : null}

            <Container className={styles.applyForEarlyAccessInner}>
                <h1>Apply for early access</h1>
                
                <p>Join a growing network of Caribbean media professionals shaping the future of regional storytelling.</p>

                <div className={styles.formWrapper}>
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.formInner}>
                            <div className={styles.formRow}>
                                <FormControl>
                                    <FormLabel htmlFor={fieldIds.firstName}>First Name *</FormLabel>
                                    <Input
                                        id={fieldIds.firstName}
                                        name="firstName"
                                        type="text"
                                        placeholder="John"
                                        autoComplete="given-name"
                                        value={formValues.firstName}
                                        onChange={(event) => updateField("firstName", event.target.value)}
                                        aria-invalid={Boolean(fieldErrors.firstName)}
                                    />
                                    {fieldErrors.firstName ? <p className={styles.fieldError}>{fieldErrors.firstName}</p> : null}
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor={fieldIds.lastName}>Last Name *</FormLabel>
                                    <Input
                                        id={fieldIds.lastName}
                                        name="lastName"
                                        type="text"
                                        placeholder="Smith"
                                        autoComplete="family-name"
                                        value={formValues.lastName}
                                        onChange={(event) => updateField("lastName", event.target.value)}
                                        aria-invalid={Boolean(fieldErrors.lastName)}
                                    />
                                    {fieldErrors.lastName ? <p className={styles.fieldError}>{fieldErrors.lastName}</p> : null}
                                </FormControl>
                            </div>

                            <FormControl>
                                <FormLabel htmlFor={fieldIds.email}>Email Address *</FormLabel>
                                <Input
                                    id={fieldIds.email}
                                    name="email"
                                    type="email"
                                    placeholder="john.smith@example.com"
                                    autoComplete="email"
                                    value={formValues.email}
                                    onChange={(event) => updateField("email", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.email)}
                                />
                                {fieldErrors.email ? <p className={styles.fieldError}>{fieldErrors.email}</p> : null}
                            </FormControl>

                            <div className={styles.formRow}>
                                <FormControl>
                                    <FormLabel htmlFor={fieldIds.publicationName}>Publication / Outlet Name *</FormLabel>
                                    <Input
                                        id={fieldIds.publicationName}
                                        name="publicationName"
                                        type="text"
                                        placeholder="Caribbean News Network"
                                        value={formValues.publicationName}
                                        onChange={(event) => updateField("publicationName", event.target.value)}
                                        aria-invalid={Boolean(fieldErrors.publicationName)}
                                    />
                                    {fieldErrors.publicationName ? <p className={styles.fieldError}>{fieldErrors.publicationName}</p> : null}
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor={fieldIds.role}>Your Role *</FormLabel>
                                    <Select
                                        id={fieldIds.role}
                                        name="role"
                                        required
                                        options={buildFieldOptions()}
                                        value={formValues.role}
                                        onChange={(event) => updateField("role", event.target.value)}
                                        aria-invalid={Boolean(fieldErrors.role)}
                                    />
                                    {fieldErrors.role ? <p className={styles.fieldError}>{fieldErrors.role}</p> : null}
                                </FormControl>
                            </div>

                            <FormControl>
                                <FormLabel htmlFor={fieldIds.coverageArea}>Coverage Area / Beat (Optional)</FormLabel>
                                <Input
                                    id={fieldIds.coverageArea}
                                    name="coverageArea"
                                    type="text"
                                    placeholder="e.g., Politics, Business, Sports, Culture"
                                    value={formValues.coverageArea}
                                    onChange={(event) => updateField("coverageArea", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.coverageArea)}
                                />
                                {fieldErrors.coverageArea ? <p className={styles.fieldError}>{fieldErrors.coverageArea}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor={fieldIds.region}>Region/Territory *</FormLabel>
                                <Select
                                    id={fieldIds.region}
                                    name="region"
                                    required
                                    options={buildRegionOptions()}
                                    value={formValues.region}
                                    onChange={(event) => updateField("region", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.region)}
                                />
                                {fieldErrors.region ? <p className={styles.fieldError}>{fieldErrors.region}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor={fieldIds.website}>Website / LinkedIn (Optional)</FormLabel>
                                <Input
                                    id={fieldIds.website}
                                    name="website"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={formValues.website}
                                    onChange={(event) => updateField("website", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.website)}
                                />
                                {fieldErrors.website ? <p className={styles.fieldError}>{fieldErrors.website}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor={fieldIds.notes}>What interests you most? (Optional)</FormLabel>
                                <Textarea
                                    id={fieldIds.notes}
                                    name="notes"
                                    placeholder="Tell us what features or benefits you're most excited about..."
                                    value={formValues.notes}
                                    onChange={(event) => updateField("notes", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.notes)}
                                />
                                {fieldErrors.notes ? <p className={styles.fieldError}>{fieldErrors.notes}</p> : null}
                            </FormControl>
                        </div>

                        <Button
                            variant="form"
                            className={styles.formSubmitBtn}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <SvgIcon icon="envelope" />
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                    </form>
                </div>
            </Container>
        </section>
    );
};
