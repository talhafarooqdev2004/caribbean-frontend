"use client";

import { useState } from "react";

import styles from "@/components/admin/AdminEnquiriesPanel.module.scss";
import {
    ADMIN_CREATE_FIELD_FROM_API,
    apiValidationErrorsByField,
    formatApiValidationErrors,
} from "@/lib/format-api-validation-errors";
import {
    COVER_PHOTO_ACCEPT,
    COVER_PHOTO_UPLOAD_HINT,
    DOCUMENT_ACCEPT,
    DOCUMENT_UPLOAD_HINT,
    validateCoverPhotoFile,
    validateDocumentFile,
} from "@/lib/press-release-upload-limits";
import { PRESS_RELEASE_CATEGORIES } from "@/lib/press-release-categories";
import { Button, FormControl, FormLabel, Input, Textarea } from "@/components/ui";

type UploadFieldKey = "coverPhoto" | "document";

export type AdminCreatePressReleaseForm = {
    fullName: string;
    email: string;
    phoneNumber: string;
    organization: string;
    title: string;
    category: string;
    island: string;
    outboundLink: string;
    summary: string;
    content: string;
};

type FieldKey = keyof AdminCreatePressReleaseForm;

export const defaultAdminCreatePressReleaseForm = (): AdminCreatePressReleaseForm => ({
    fullName: "Carib Newswire",
    email: "info@caribnewswire.com",
    phoneNumber: "",
    organization: "Carib Newswire",
    title: "",
    category: "",
    island: "Regional",
    outboundLink: "",
    summary: "",
    content: "",
});

function validateCreateForm(form: AdminCreatePressReleaseForm): Partial<Record<FieldKey, string>> {
    const errors: Partial<Record<FieldKey, string>> = {};

    if (!form.fullName.trim()) {
        errors.fullName = "Full name is required.";
    }

    if (!form.email.trim()) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = "Enter a valid email address.";
    }

    if (!form.organization.trim()) {
        errors.organization = "Organization is required.";
    }

    if (!form.title.trim()) {
        errors.title = "Title is required.";
    } else if (form.title.trim().length < 3) {
        errors.title = "Title must be at least 3 characters.";
    }

    if (!form.category.trim()) {
        errors.category = "Category is required.";
    }

    if (!form.summary.trim()) {
        errors.summary = "Summary is required.";
    } else if (form.summary.trim().length > 300) {
        errors.summary = "Summary must be 300 characters or less.";
    }

    if (!form.content.trim()) {
        errors.content = "Press release content is required.";
    }

    return errors;
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className={styles.editReleaseFieldNote}>{message}</p>;
}

type AdminCreatePressReleaseModalProps = {
    onClose: () => void;
    onCreated: () => void | Promise<void>;
};

export function AdminCreatePressReleaseModal({ onClose, onCreated }: AdminCreatePressReleaseModalProps) {
    const [form, setForm] = useState<AdminCreatePressReleaseForm>(defaultAdminCreatePressReleaseForm);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
    const [uploadFieldErrors, setUploadFieldErrors] = useState<Partial<Record<UploadFieldKey, string>>>({});
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function clearFieldError(key: FieldKey) {
        setFieldErrors((prev) => {
            if (!prev[key]) {
                return prev;
            }

            const next = { ...prev };
            delete next[key];
            return next;
        });
    }

    function clearUploadFieldError(key: UploadFieldKey) {
        setUploadFieldErrors((prev) => {
            if (!prev[key]) {
                return prev;
            }

            const next = { ...prev };
            delete next[key];
            return next;
        });
    }

    async function handleSubmit() {
        const clientErrors = validateCreateForm(form);
        const nextUploadErrors: Partial<Record<UploadFieldKey, string>> = {};

        if (coverFile) {
            const coverError = validateCoverPhotoFile(coverFile);

            if (coverError) {
                nextUploadErrors.coverPhoto = coverError;
            }
        }

        if (documentFile) {
            const documentError = validateDocumentFile(documentFile);

            if (documentError) {
                nextUploadErrors.document = documentError;
            }
        }

        if (Object.keys(clientErrors).length > 0 || Object.keys(nextUploadErrors).length > 0) {
            setFieldErrors(clientErrors);
            setUploadFieldErrors(nextUploadErrors);
            setError(
                Object.keys(nextUploadErrors).length > 0
                    ? Object.values(nextUploadErrors)[0] ?? "Please fix the fields marked below."
                    : "Please fix the fields marked below.",
            );
            return;
        }

        setBusy(true);
        setError(null);
        setFieldErrors({});
        setUploadFieldErrors({});

        try {
            const body = new FormData();
            body.append("fullName", form.fullName.trim());
            body.append("email", form.email.trim());
            body.append("phoneNumber", form.phoneNumber.trim());
            body.append("organization", form.organization.trim());
            body.append("releaseTitle", form.title.trim());
            body.append("category", form.category.trim());
            body.append("island", form.island.trim() || "Regional");
            body.append("outboundLink", form.outboundLink.trim());
            body.append("summary", form.summary.trim());
            body.append("pressReleaseContent", form.content);
            body.append("packageId", "custom");

            if (coverFile) {
                body.append("coverPhoto", coverFile);
            }

            if (documentFile) {
                body.append("document", documentFile);
            }

            const response = await fetch("/api/admin/press-releases", {
                method: "POST",
                body,
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                const byApiField = apiValidationErrorsByField(payload);
                const mapped: Partial<Record<FieldKey, string>> = {};
                const mappedUploadErrors: Partial<Record<UploadFieldKey, string>> = {};

                for (const [apiField, message] of Object.entries(byApiField)) {
                    const formKey = ADMIN_CREATE_FIELD_FROM_API[apiField];

                    if (formKey === "coverPhoto" || formKey === "document") {
                        mappedUploadErrors[formKey] = message;
                        continue;
                    }

                    if (formKey && formKey in form) {
                        mapped[formKey as FieldKey] = message;
                    }
                }

                if (Object.keys(mapped).length > 0) {
                    setFieldErrors(mapped);
                }

                if (Object.keys(mappedUploadErrors).length > 0) {
                    setUploadFieldErrors(mappedUploadErrors);
                }

                setError(formatApiValidationErrors(payload, "Could not create press release."));
                return;
            }

            await onCreated();
            onClose();
        } catch {
            setError("Could not create press release. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="create-release-heading">
            <div className={styles.editReleaseModal}>
                <div className={styles.editReleaseModalHeader}>
                    <div className={styles.editReleaseModalHeaderText}>
                        <h2 id="create-release-heading">Create press release</h2>
                    </div>
                    <button type="button" className={styles.editReleaseModalClose} onClick={onClose} aria-label="Close dialog" disabled={busy}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>

                <div className={styles.editReleaseModalFields}>
                    <div className={styles.editReleaseSection}>
                        <h3 className={styles.editReleaseSectionTitle}>Submitter</h3>
                        <FormControl>
                            <FormLabel htmlFor="create-release-full-name">Full name</FormLabel>
                            <Input
                                id="create-release-full-name"
                                value={form.fullName}
                                onChange={(event) => {
                                    setForm({ ...form, fullName: event.target.value });
                                    clearFieldError("fullName");
                                }}
                                aria-invalid={Boolean(fieldErrors.fullName)}
                                autoComplete="off"
                            />
                            <FieldError message={fieldErrors.fullName} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="create-release-email">Email</FormLabel>
                            <Input
                                id="create-release-email"
                                type="email"
                                value={form.email}
                                onChange={(event) => {
                                    setForm({ ...form, email: event.target.value });
                                    clearFieldError("email");
                                }}
                                aria-invalid={Boolean(fieldErrors.email)}
                                autoComplete="off"
                            />
                            <FieldError message={fieldErrors.email} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="create-release-phone">Phone</FormLabel>
                            <Input
                                id="create-release-phone"
                                value={form.phoneNumber}
                                onChange={(event) => {
                                    setForm({ ...form, phoneNumber: event.target.value });
                                    clearFieldError("phoneNumber");
                                }}
                                aria-invalid={Boolean(fieldErrors.phoneNumber)}
                                autoComplete="off"
                            />
                            <FieldError message={fieldErrors.phoneNumber} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="create-release-organization">Organization</FormLabel>
                            <Input
                                id="create-release-organization"
                                value={form.organization}
                                onChange={(event) => {
                                    setForm({ ...form, organization: event.target.value });
                                    clearFieldError("organization");
                                }}
                                aria-invalid={Boolean(fieldErrors.organization)}
                                autoComplete="off"
                            />
                            <FieldError message={fieldErrors.organization} />
                        </FormControl>
                    </div>

                    <div className={styles.editReleaseSection}>
                        <h3 className={styles.editReleaseSectionTitle}>Release details</h3>
                        <FormControl>
                            <FormLabel htmlFor="create-release-title">Release title</FormLabel>
                            <Input
                                id="create-release-title"
                                value={form.title}
                                onChange={(event) => {
                                    setForm({ ...form, title: event.target.value });
                                    clearFieldError("title");
                                }}
                                aria-invalid={Boolean(fieldErrors.title)}
                                autoComplete="off"
                            />
                            <FieldError message={fieldErrors.title} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="create-release-category">Category</FormLabel>
                            <select
                                id="create-release-category"
                                className={styles.editReleaseSelect}
                                value={form.category}
                                onChange={(event) => {
                                    setForm({ ...form, category: event.target.value });
                                    clearFieldError("category");
                                }}
                                aria-invalid={Boolean(fieldErrors.category)}
                            >
                                <option value="">Select category</option>
                                {PRESS_RELEASE_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={fieldErrors.category} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="create-release-island">Region / island</FormLabel>
                            <Input
                                id="create-release-island"
                                value={form.island}
                                onChange={(event) => {
                                    setForm({ ...form, island: event.target.value });
                                    clearFieldError("island");
                                }}
                                aria-invalid={Boolean(fieldErrors.island)}
                                autoComplete="off"
                            />
                            <FieldError message={fieldErrors.island} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="create-release-outbound-link">Outbound link (optional)</FormLabel>
                            <Input
                                id="create-release-outbound-link"
                                type="url"
                                inputMode="url"
                                autoComplete="url"
                                placeholder="https://yourwebsite.com"
                                value={form.outboundLink}
                                onChange={(event) => {
                                    setForm({ ...form, outboundLink: event.target.value });
                                    clearFieldError("outboundLink");
                                }}
                                aria-invalid={Boolean(fieldErrors.outboundLink)}
                            />
                            <FieldError message={fieldErrors.outboundLink} />
                        </FormControl>
                    </div>

                    <div className={styles.editReleaseSection}>
                        <h3 className={styles.editReleaseSectionTitle}>Uploaded files</h3>
                        <div className={styles.editReleaseFileRows}>
                            <div className={styles.editReleaseFileRow}>
                                <div className={styles.editReleaseFilePreview}>
                                    <div className={styles.editReleaseFilePlaceholder}>Cover image (optional)</div>
                                </div>
                                <div className={styles.editReleaseFileMeta}>
                                    <p className={styles.editReleaseAssetLabel}>Cover image</p>
                                    <span className={styles.editReleaseFileInputLabel}>Upload cover</span>
                                    <p className={styles.editReleaseFieldNote}>{COVER_PHOTO_UPLOAD_HINT}</p>
                                    <input
                                        type="file"
                                        accept={COVER_PHOTO_ACCEPT}
                                        className={styles.editReleaseFileInputNative}
                                        onChange={(event) => {
                                            const selectedFile = event.target.files?.[0] ?? null;
                                            setCoverFile(selectedFile);
                                            clearUploadFieldError("coverPhoto");

                                            if (!selectedFile) {
                                                return;
                                            }

                                            const validationError = validateCoverPhotoFile(selectedFile);

                                            if (validationError) {
                                                setUploadFieldErrors((current) => ({
                                                    ...current,
                                                    coverPhoto: validationError,
                                                }));
                                                setError(validationError);
                                                setCoverFile(null);
                                                event.target.value = "";
                                            }
                                        }}
                                    />
                                    {coverFile ? (
                                        <p className={styles.editReleaseFileSelected}>Selected: {coverFile.name}</p>
                                    ) : null}
                                    <FieldError message={uploadFieldErrors.coverPhoto} />
                                </div>
                            </div>
                            <div className={styles.editReleaseFileRow}>
                                <div className={styles.editReleaseFilePreview}>
                                    <div className={styles.editReleaseDocBadge} aria-hidden="true">DOC</div>
                                </div>
                                <div className={styles.editReleaseFileMeta}>
                                    <p className={styles.editReleaseAssetLabel}>Attached document</p>
                                    <span className={styles.editReleaseFileInputLabel}>Upload document</span>
                                    <p className={styles.editReleaseFieldNote}>{DOCUMENT_UPLOAD_HINT}</p>
                                    <input
                                        type="file"
                                        accept={DOCUMENT_ACCEPT}
                                        className={styles.editReleaseFileInputNative}
                                        onChange={(event) => {
                                            const selectedFile = event.target.files?.[0] ?? null;
                                            setDocumentFile(selectedFile);
                                            clearUploadFieldError("document");

                                            if (!selectedFile) {
                                                return;
                                            }

                                            const validationError = validateDocumentFile(selectedFile);

                                            if (validationError) {
                                                setUploadFieldErrors((current) => ({
                                                    ...current,
                                                    document: validationError,
                                                }));
                                                setError(validationError);
                                                setDocumentFile(null);
                                                event.target.value = "";
                                            }
                                        }}
                                    />
                                    {documentFile ? (
                                        <p className={styles.editReleaseFileSelected}>Selected: {documentFile.name}</p>
                                    ) : null}
                                    <FieldError message={uploadFieldErrors.document} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.editReleaseSection}>
                        <FormControl>
                            <FormLabel htmlFor="create-release-summary">Summary</FormLabel>
                            <Textarea
                                id="create-release-summary"
                                rows={4}
                                value={form.summary}
                                onChange={(event) => {
                                    setForm((prev) => ({ ...prev, summary: event.target.value }));
                                    clearFieldError("summary");
                                }}
                                aria-invalid={Boolean(fieldErrors.summary)}
                            />
                            <FieldError message={fieldErrors.summary} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="create-release-content">Press release content</FormLabel>
                            <Textarea
                                id="create-release-content"
                                rows={10}
                                value={form.content}
                                onChange={(event) => {
                                    setForm((prev) => ({ ...prev, content: event.target.value }));
                                    clearFieldError("content");
                                }}
                                aria-invalid={Boolean(fieldErrors.content)}
                            />
                            <FieldError message={fieldErrors.content} />
                        </FormControl>
                    </div>
                </div>

                {error ? <p className={styles.editReleaseRejectionNote}>{error}</p> : null}

                <div className={styles.actionGroup}>
                    <Button type="button" variant="outline" size="md" onClick={onClose} disabled={busy}>
                        Cancel
                    </Button>
                    <Button type="button" variant="primary" size="md" onClick={handleSubmit} disabled={busy}>
                        {busy ? "Creating…" : "Create release"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
