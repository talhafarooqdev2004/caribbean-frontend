"use client";

import styles from "./BecomeACaribNewaMediaPartner.module.scss";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "../layout";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    SvgIcon,
    Textarea,
} from "../ui";

type ToastState = {
    tone: "success" | "error";
    message: string;
};

type PartnerFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    organization: string;
    phone: string;
    mediaOutlet: string;
    location: string;
    primaryBeat: string;
    briefBio: string;
};

type PartnerFormErrors = Partial<Record<keyof PartnerFormValues, string>>;

const initialPartnerFormValues: PartnerFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    phone: "",
    mediaOutlet: "",
    location: "",
    primaryBeat: "",
    briefBio: "",
};

const fieldIds = {
    firstName: "partner-first-name",
    lastName: "partner-last-name",
    email: "partner-email",
    password: "partner-password",
    confirmPassword: "partner-confirm-password",
    organization: "partner-organization",
    phone: "partner-phone",
    mediaOutlet: "partner-media-outlet",
    location: "partner-location",
    primaryBeat: "partner-primary-beat",
    briefBio: "partner-brief-bio",
} as const;

const fieldLengthLimits: Record<keyof PartnerFormValues, number> = {
    firstName: 80,
    lastName: 80,
    email: 254,
    password: 200,
    confirmPassword: 200,
    organization: 140,
    phone: 40,
    mediaOutlet: 140,
    location: 160,
    primaryBeat: 160,
    briefBio: 1000,
};

function normalizeText(value: string) {
    return value.trim().replace(/\s+/g, " ");
}

function validatePartnerForm(input: PartnerFormValues) {
    const values: PartnerFormValues = {
        firstName: normalizeText(input.firstName),
        lastName: normalizeText(input.lastName),
        email: normalizeText(input.email).toLowerCase(),
        password: input.password,
        confirmPassword: input.confirmPassword,
        organization: normalizeText(input.organization),
        phone: normalizeText(input.phone),
        mediaOutlet: normalizeText(input.mediaOutlet),
        location: normalizeText(input.location),
        primaryBeat: normalizeText(input.primaryBeat),
        briefBio: normalizeText(input.briefBio),
    };

    const errors: PartnerFormErrors = {};

    if (!values.firstName) {
        errors.firstName = "First name is required.";
    }

    if (!values.lastName) {
        errors.lastName = "Last name is required.";
    }

    if (!values.email) {
        errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Enter a valid email address.";
    }

    if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    }

    if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords must match.";
    }

    for (const [field, limit] of Object.entries(fieldLengthLimits) as Array<[keyof PartnerFormValues, number]>) {
        const value = values[field];

        if (typeof value === "string" && value.length > limit) {
            errors[field] = `Please keep this under ${limit} characters.`;
        }
    }

    return {
        values: Object.keys(errors).length > 0 ? null : values,
        errors,
    };
}

export default function BecomeACaribNewaMediaPartner() {
    const router = useRouter();
    const [formValues, setFormValues] = useState<PartnerFormValues>(initialPartnerFormValues);
    const [fieldErrors, setFieldErrors] = useState<PartnerFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeoutId = window.setTimeout(() => setToast(null), 4000);

        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    function updateField<K extends keyof PartnerFormValues>(field: K, value: PartnerFormValues[K]) {
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

        const validation = validatePartnerForm(formValues);

        if (!validation.values) {
            setFieldErrors(validation.errors);
            setToast({
                tone: "error",
                message: "Please review the highlighted fields and try again.",
            });
            return;
        }

        setFieldErrors({});
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: validation.values.firstName,
                    lastName: validation.values.lastName,
                    email: validation.values.email,
                    password: validation.values.password,
                    confirmPassword: validation.values.confirmPassword,
                    organization: validation.values.organization,
                    phone: validation.values.phone,
                    mediaOutlet: validation.values.mediaOutlet,
                    location: validation.values.location,
                    primaryBeat: validation.values.primaryBeat,
                    bio: validation.values.briefBio,
                    digestOptIn: true,
                }),
            });

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                const message = typeof payload?.error === "string"
                    ? payload.error
                    : "We could not create your account right now. Please try again.";

                setToast({
                    tone: "error",
                    message,
                });
                return;
            }

            if (typeof payload?.token === "string") {
                window.localStorage.setItem("carib_token", payload.token);
                window.localStorage.setItem("caribbean_news_submitter_token", payload.token);
            }

            if (payload?.user) {
                window.localStorage.setItem("carib_user", JSON.stringify(payload.user));
            }

            router.replace("/portal");
            router.refresh();
        } catch {
            setToast({
                tone: "error",
                message: "We could not create your account right now. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className={styles.becomeAPartner}>
            {toast ? (
                <div
                    className={`${styles.toast} ${toast.tone === "success" ? styles.toastSuccess : styles.toastError}`}
                    role="status"
                    aria-live="polite"
                >
                    <span>{toast.message}</span>
                </div>
            ) : null}

            <Container className={styles.becomeAPartnerInner}>
                <div className={styles.detailsSection}>
                    <h1>Become a Carib Newswire Media Partner</h1>

                    <p>Create one account for submissions, credits, and saved stories.</p>

                    <div className={styles.points}>
                        <div className={styles.point}>
                            <SvgIcon icon="become-partner-point" />
                            Stay informed
                        </div>
                        <div className={styles.point}>
                            <SvgIcon icon="become-partner-point" />
                            Stay connected
                        </div>
                        <div className={styles.point}>
                            <SvgIcon icon="become-partner-point" />
                            Stay ahead
                        </div>
                    </div>
                </div>

                <div id="join-network-form" className={styles.formCard}>
                    <h1>Join the Network</h1>

                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
                                placeholder="john@newsoutlet.com"
                                autoComplete="email"
                                value={formValues.email}
                                onChange={(event) => updateField("email", event.target.value)}
                                aria-invalid={Boolean(fieldErrors.email)}
                            />
                            {fieldErrors.email ? <p className={styles.fieldError}>{fieldErrors.email}</p> : null}
                        </FormControl>

                        <div className={styles.formRow}>
                            <FormControl>
                                <FormLabel htmlFor={fieldIds.password}>Password *</FormLabel>
                                <Input
                                    id={fieldIds.password}
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={formValues.password}
                                    onChange={(event) => updateField("password", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.password)}
                                />
                                {fieldErrors.password ? <p className={styles.fieldError}>{fieldErrors.password}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor={fieldIds.confirmPassword}>Confirm Password *</FormLabel>
                                <Input
                                    id={fieldIds.confirmPassword}
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    value={formValues.confirmPassword}
                                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                                />
                                {fieldErrors.confirmPassword ? <p className={styles.fieldError}>{fieldErrors.confirmPassword}</p> : null}
                            </FormControl>
                        </div>

                        <div className={styles.formRow}>
                            <FormControl>
                                <FormLabel htmlFor={fieldIds.organization}>Organization (optional)</FormLabel>
                                <Input
                                    id={fieldIds.organization}
                                    name="organization"
                                    type="text"
                                    value={formValues.organization}
                                    onChange={(event) => updateField("organization", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.organization)}
                                />
                                {fieldErrors.organization ? <p className={styles.fieldError}>{fieldErrors.organization}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor={fieldIds.phone}>Phone (optional)</FormLabel>
                                <Input
                                    id={fieldIds.phone}
                                    name="phone"
                                    type="tel"
                                    value={formValues.phone}
                                    onChange={(event) => updateField("phone", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.phone)}
                                />
                                {fieldErrors.phone ? <p className={styles.fieldError}>{fieldErrors.phone}</p> : null}
                            </FormControl>
                        </div>

                        <div className={styles.formRow}>
                            <FormControl>
                                <FormLabel htmlFor={fieldIds.mediaOutlet}>Media Outlet (optional)</FormLabel>
                                <Input
                                    id={fieldIds.mediaOutlet}
                                    name="mediaOutlet"
                                    type="text"
                                    placeholder="Caribbean News Network"
                                    value={formValues.mediaOutlet}
                                    onChange={(event) => updateField("mediaOutlet", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.mediaOutlet)}
                                />
                                {fieldErrors.mediaOutlet ? <p className={styles.fieldError}>{fieldErrors.mediaOutlet}</p> : null}
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor={fieldIds.location}>Location (optional)</FormLabel>
                                <Input
                                    id={fieldIds.location}
                                    name="location"
                                    type="text"
                                    placeholder="e.g., Jamaica, United States, United Kingdom"
                                    autoComplete="address-level2"
                                    value={formValues.location}
                                    onChange={(event) => updateField("location", event.target.value)}
                                    aria-invalid={Boolean(fieldErrors.location)}
                                />
                                {fieldErrors.location ? <p className={styles.fieldError}>{fieldErrors.location}</p> : null}
                            </FormControl>
                        </div>

                        <FormControl>
                            <FormLabel htmlFor={fieldIds.primaryBeat}>Primary Beat/Category (optional)</FormLabel>
                            <Input
                                id={fieldIds.primaryBeat}
                                name="primaryBeat"
                                type="text"
                                placeholder="e.g., Politics, Business, Culture"
                                value={formValues.primaryBeat}
                                onChange={(event) => updateField("primaryBeat", event.target.value)}
                                aria-invalid={Boolean(fieldErrors.primaryBeat)}
                            />
                            {fieldErrors.primaryBeat ? <p className={styles.fieldError}>{fieldErrors.primaryBeat}</p> : null}
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor={fieldIds.briefBio}>Brief Bio (optional)</FormLabel>
                            <Textarea
                                className={styles.briefBioTextarea}
                                id={fieldIds.briefBio}
                                name="briefBio"
                                placeholder="Tell us a bit about your work and coverage."
                                value={formValues.briefBio}
                                onChange={(event) => updateField("briefBio", event.target.value)}
                                aria-invalid={Boolean(fieldErrors.briefBio)}
                            />
                            {fieldErrors.briefBio ? <p className={styles.fieldError}>{fieldErrors.briefBio}</p> : null}
                        </FormControl>

                        <Button
                            variant="join-the-network"
                            className={styles.submitButton}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Join the Network"}
                        </Button>
                    </form>

                    <p className={styles.disclaimer}>
                        By signing up, you agree to receive press releases and updates from Carib Newswire.
                        {" "}Already a member? <Link href="/login">Log in</Link>
                    </p>
                </div>
            </Container>
        </section>
    );
}
