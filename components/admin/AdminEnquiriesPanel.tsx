"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "./AdminEnquiriesPanel.module.scss";

import { Button } from "@/components/ui";
import { Container } from "@/components/layout";
import { type EnquiryRecord } from "@/lib/enquiries";
import { roleOptions, territoryOptions } from "@/lib/enquiry-options";

type ToastState = {
    tone: "success" | "error";
    message: string;
};

type AdminEnquiriesPanelProps = {
    initialEnquiries: EnquiryRecord[];
    initialLoadError?: string;
};

function getRoleLabel(value: string) {
    return roleOptions.find((option) => option.value === value)?.label ?? value;
}

function getRegionLabel(value: string) {
    return territoryOptions.find((option) => option.value === value)?.label ?? value;
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminEnquiriesPanel({ initialEnquiries, initialLoadError }: AdminEnquiriesPanelProps) {
    const router = useRouter();
    const [enquiries, setEnquiries] = useState(initialEnquiries);
    const [expandedId, setExpandedId] = useState<string | null>(initialEnquiries[0]?.id ?? null);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const selectedEnquiry = useMemo(
        () => enquiries.find((enquiry) => enquiry.id === expandedId) ?? enquiries[0] ?? null,
        [enquiries, expandedId]
    );

    useEffect(() => {
        setEnquiries(initialEnquiries);
        setExpandedId(initialEnquiries[0]?.id ?? null);
    }, [initialEnquiries]);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeoutId = window.setTimeout(() => setToast(null), 4000);

        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    async function refreshEnquiries() {
        setIsRefreshing(true);

        try {
            const response = await fetch("/api/enquiries", {
                method: "GET",
                cache: "no-store",
            });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setToast({
                    tone: "error",
                    message: typeof payload?.error === "string" ? payload.error : "We could not refresh enquiries.",
                });
                return;
            }

            const nextEnquiries = Array.isArray(payload?.enquiries) ? payload.enquiries : [];

            setEnquiries(nextEnquiries);
            setExpandedId((current) => {
                if (current && nextEnquiries.some((enquiry: EnquiryRecord) => enquiry.id === current)) {
                    return current;
                }

                return nextEnquiries[0]?.id ?? null;
            });

            setToast({
                tone: "success",
                message: "Enquiries refreshed successfully.",
            });
        } catch {
            setToast({
                tone: "error",
                message: "We could not refresh enquiries right now.",
            });
        } finally {
            setIsRefreshing(false);
        }
    }

    async function handleDelete(enquiryId: string) {
        if (!window.confirm("Delete this enquiry? This action cannot be undone.")) {
            return;
        }

        setDeletingId(enquiryId);

        try {
            const response = await fetch(`/api/enquiries/${enquiryId}`, {
                method: "DELETE",
            });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setToast({
                    tone: "error",
                    message: typeof payload?.error === "string" ? payload.error : "We could not delete that enquiry.",
                });
                return;
            }

            setEnquiries((current) => {
                const next = current.filter((enquiry) => enquiry.id !== enquiryId);
                if (expandedId === enquiryId) {
                    setExpandedId(next[0]?.id ?? null);
                }
                return next;
            });

            setToast({
                tone: "success",
                message: "Enquiry deleted successfully.",
            });
        } catch {
            setToast({
                tone: "error",
                message: "We could not delete that enquiry right now.",
            });
        } finally {
            setDeletingId(null);
        }
    }

    async function handleLogout() {
        setIsLoggingOut(true);

        try {
            await fetch("/api/admin/logout", {
                method: "POST",
            });
        } finally {
            router.replace("/admin/login");
            router.refresh();
        }
    }

    return (
        <section className={styles.adminPanel}>
            {initialLoadError ? (
                <div className={`${styles.toast} ${styles.toastError}`} role="status" aria-live="polite">
                    {initialLoadError}
                </div>
            ) : null}

            {toast ? (
                <div
                    className={`${styles.toast} ${toast.tone === "success" ? styles.toastSuccess : styles.toastError}`}
                    role="status"
                    aria-live="polite"
                >
                    {toast.message}
                </div>
            ) : null}

            <Container className={styles.adminPanelInner}>
                <div className={styles.hero}>
                    <div>
                        <span className={styles.kicker}>Admin enquiries</span>
                        <h1>Manage media signup enquiries</h1>
                        <p>Review submissions, open individual enquiry details, and remove spam or duplicates when needed.</p>
                    </div>

                    <div className={styles.heroActions}>
                        <Button type="button" variant="secondary" size="md" onClick={refreshEnquiries} disabled={isRefreshing}>
                            {isRefreshing ? "Refreshing..." : "Refresh"}
                        </Button>
                        <Button type="button" variant="primary" size="md" onClick={handleLogout} disabled={isLoggingOut}>
                            {isLoggingOut ? "Signing out..." : "Sign out"}
                        </Button>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <article className={styles.statCard}>
                        <span>Total enquiries</span>
                        <strong>{enquiries.length}</strong>
                    </article>
                    <article className={styles.statCard}>
                        <span>Latest submission</span>
                        <strong>{selectedEnquiry ? formatDate(selectedEnquiry.createdAt) : "No enquiries yet"}</strong>
                    </article>
                    <article className={styles.statCard}>
                        <span>Quick access</span>
                        <strong>
                            <Link href="/media-signup">Public application page</Link>
                        </strong>
                    </article>
                </div>

                {enquiries.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>No enquiries yet</h2>
                        <p>Applications submitted through the early access form will appear here automatically.</p>
                    </div>
                ) : (
                    <div className={styles.contentGrid}>
                        <div className={styles.listPanel}>
                            {enquiries.map((enquiry) => {
                                const isExpanded = enquiry.id === expandedId;

                                return (
                                    <article key={enquiry.id} className={`${styles.enquiryCard} ${isExpanded ? styles.enquiryCardActive : ""}`}>
                                        <button
                                            type="button"
                                            className={styles.enquirySummary}
                                            onClick={() => setExpandedId(isExpanded ? null : enquiry.id)}
                                        >
                                            <div>
                                                <span className={styles.enquiryName}>{enquiry.firstName} {enquiry.lastName}</span>
                                                <span className={styles.enquiryMeta}>{enquiry.publicationName}</span>
                                            </div>

                                            <div className={styles.enquirySummarySide}>
                                                <span className={styles.badge}>{getRoleLabel(enquiry.role)}</span>
                                                <span className={styles.timestamp}>{formatDate(enquiry.createdAt)}</span>
                                            </div>
                                        </button>

                                        {isExpanded ? (
                                            <div className={styles.enquiryDetails}>
                                                <dl>
                                                    <div>
                                                        <dt>Email</dt>
                                                        <dd>{enquiry.email}</dd>
                                                    </div>
                                                    <div>
                                                        <dt>Region</dt>
                                                        <dd>{getRegionLabel(enquiry.region)}</dd>
                                                    </div>
                                                    <div>
                                                        <dt>Coverage</dt>
                                                        <dd>{enquiry.coverageArea || "Not provided"}</dd>
                                                    </div>
                                                    <div>
                                                        <dt>Website</dt>
                                                        <dd>
                                                            {enquiry.website ? (
                                                                <a href={enquiry.website} target="_blank" rel="noreferrer">
                                                                    {enquiry.website}
                                                                </a>
                                                            ) : (
                                                                "Not provided"
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt>Interests</dt>
                                                        <dd>{enquiry.notes || "Not provided"}</dd>
                                                    </div>
                                                </dl>

                                                <div className={styles.cardActions}>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="md"
                                                        onClick={() => handleDelete(enquiry.id)}
                                                        disabled={deletingId === enquiry.id}
                                                    >
                                                        {deletingId === enquiry.id ? "Deleting..." : "Delete enquiry"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : null}
                                    </article>
                                );
                            })}
                        </div>

                        <aside className={styles.detailPanel}>
                            <span className={styles.detailLabel}>Selected enquiry</span>
                            {selectedEnquiry ? (
                                <>
                                    <h2>{selectedEnquiry.firstName} {selectedEnquiry.lastName}</h2>
                                    <p>{selectedEnquiry.publicationName}</p>

                                    <ul className={styles.detailList}>
                                        <li><strong>Email:</strong> {selectedEnquiry.email}</li>
                                        <li><strong>Role:</strong> {getRoleLabel(selectedEnquiry.role)}</li>
                                        <li><strong>Region:</strong> {getRegionLabel(selectedEnquiry.region)}</li>
                                        <li><strong>Submitted:</strong> {formatDate(selectedEnquiry.createdAt)}</li>
                                    </ul>

                                    <div className={styles.detailCopy}>
                                        <strong>Coverage area</strong>
                                        <p>{selectedEnquiry.coverageArea || "Not provided"}</p>
                                    </div>

                                    <div className={styles.detailCopy}>
                                        <strong>Website</strong>
                                        <p>
                                            {selectedEnquiry.website ? (
                                                <a href={selectedEnquiry.website} target="_blank" rel="noreferrer">
                                                    {selectedEnquiry.website}
                                                </a>
                                            ) : (
                                                "Not provided"
                                            )}
                                        </p>
                                    </div>

                                    <div className={styles.detailCopy}>
                                        <strong>Notes</strong>
                                        <p>{selectedEnquiry.notes || "Not provided"}</p>
                                    </div>
                                </>
                            ) : (
                                <p className={styles.detailEmpty}>Select an enquiry to view the full details.</p>
                            )}
                        </aside>
                    </div>
                )}
            </Container>
        </section>
    );
}
