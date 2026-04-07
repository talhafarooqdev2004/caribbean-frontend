"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./AdminEnquiriesPanel.module.scss";

import { Button } from "@/components/ui";
import { Container } from "@/components/layout";
import { ENQUIRY_STATUSES, type EnquiryRecord, type EnquiryStatus } from "@/lib/enquiry-types";
import { roleOptions, territoryOptions } from "@/lib/enquiry-options";

type ToastState = {
    tone: "success" | "error";
    message: string;
};

type AdminEnquiriesPanelProps = {
    initialEnquiries: EnquiryRecord[];
    initialLoadError?: string;
};

type StatusConfig = {
    label: string;
    description: string;
    className: string;
};

const statusConfig: Record<EnquiryStatus, StatusConfig> = {
    pending: {
        label: "Pending",
        description: "Awaiting review",
        className: styles.statusPending,
    },
    approved: {
        label: "Approved",
        description: "Accepted by admin",
        className: styles.statusApproved,
    },
    rejected: {
        label: "Rejected",
        description: "Declined by admin",
        className: styles.statusRejected,
    },
};

const statusTabs = ENQUIRY_STATUSES.map((status) => ({
    status,
    ...statusConfig[status],
}));

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

function getActionLabel(status: EnquiryStatus) {
    if (status === "pending") {
        return "Approve enquiry";
    }

    return "Move back to pending";
}

function getActionLoadingLabel(status: EnquiryStatus) {
    if (status === "pending") {
        return "Updating...";
    }

    return "Reverting...";
}

export default function AdminEnquiriesPanel({ initialEnquiries, initialLoadError }: AdminEnquiriesPanelProps) {
    const router = useRouter();
    const [enquiries, setEnquiries] = useState(initialEnquiries);
    const [activeTab, setActiveTab] = useState<EnquiryStatus>("pending");
    const [expandedId, setExpandedId] = useState<string | null>(initialEnquiries.find((enquiry) => enquiry.status === "pending")?.id ?? initialEnquiries[0]?.id ?? null);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [statusAction, setStatusAction] = useState<{ id: string; status: EnquiryStatus } | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const counts = useMemo(() => {
        const initialCounts: Record<"total" | EnquiryStatus, number> = {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
        };

        return enquiries.reduce((accumulator, enquiry) => {
            accumulator[enquiry.status] += 1;
            accumulator.total += 1;
            return accumulator;
        }, initialCounts);
    }, [enquiries]);

    const visibleEnquiries = useMemo(
        () => enquiries.filter((enquiry) => enquiry.status === activeTab),
        [enquiries, activeTab]
    );

    const selectedEnquiry = useMemo(
        () => visibleEnquiries.find((enquiry) => enquiry.id === expandedId) ?? visibleEnquiries[0] ?? null,
        [visibleEnquiries, expandedId]
    );

    const emptyStateCopy = useMemo(() => {
        if (activeTab === "approved") {
            return {
                title: "No approved enquiries",
                description: "Use the approve action on a pending enquiry to move it here.",
            };
        }

        if (activeTab === "rejected") {
            return {
                title: "No rejected enquiries",
                description: "Rejected enquiries will appear here until you move them back to pending.",
            };
        }

        return {
            title: "No pending enquiries",
            description: "Applications submitted through the early access form will appear here for review.",
        };
    }, [activeTab]);

    useEffect(() => {
        setEnquiries(initialEnquiries);
    }, [initialEnquiries]);

    useEffect(() => {
        setExpandedId((current) => {
            if (current && visibleEnquiries.some((enquiry) => enquiry.id === current)) {
                return current;
            }

            return visibleEnquiries[0]?.id ?? null;
        });
    }, [visibleEnquiries]);

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

    async function syncStatusChange(enquiryId: string, nextStatus: EnquiryStatus) {
        setStatusAction({ id: enquiryId, status: nextStatus });

        try {
            const response = await fetch(`/api/enquiries/${enquiryId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: nextStatus,
                }),
            });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setToast({
                    tone: "error",
                    message: typeof payload?.error === "string" ? payload.error : "We could not update that enquiry.",
                });
                return;
            }

            const updatedEnquiry = payload?.enquiry as EnquiryRecord | undefined;

            if (updatedEnquiry) {
                setEnquiries((current) =>
                    current.map((enquiry) => (enquiry.id === updatedEnquiry.id ? updatedEnquiry : enquiry))
                );
            } else {
                await refreshEnquiries();
            }

            setToast({
                tone: "success",
                message:
                    nextStatus === "approved"
                        ? "Enquiry approved successfully."
                        : nextStatus === "rejected"
                            ? "Enquiry rejected successfully."
                            : "Enquiry moved back to pending.",
            });
        } catch {
            setToast({
                tone: "error",
                message: "We could not update that enquiry right now.",
            });
        } finally {
            setStatusAction(null);
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

            setEnquiries((current) => current.filter((enquiry) => enquiry.id !== enquiryId));

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

    function renderCardActions(enquiry: EnquiryRecord) {
        const actionBusy = statusAction?.id === enquiry.id;
        const isPending = enquiry.status === "pending";

        return (
            <div className={styles.cardActions}>
                <div className={styles.actionGroup}>
                    {isPending ? (
                        <>
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={() => syncStatusChange(enquiry.id, "approved")}
                                disabled={actionBusy || deletingId === enquiry.id}
                            >
                                {actionBusy && statusAction?.status === "approved" ? "Approving..." : "Approve"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => syncStatusChange(enquiry.id, "rejected")}
                                disabled={actionBusy || deletingId === enquiry.id}
                            >
                                {actionBusy && statusAction?.status === "rejected" ? "Rejecting..." : "Reject"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={() => syncStatusChange(enquiry.id, "pending")}
                            disabled={actionBusy || deletingId === enquiry.id}
                        >
                            {actionBusy && statusAction?.status === "pending"
                                ? getActionLoadingLabel(enquiry.status)
                                : getActionLabel(enquiry.status)}
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => handleDelete(enquiry.id)}
                        disabled={deletingId === enquiry.id || actionBusy}
                    >
                        {deletingId === enquiry.id ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        );
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
                        <p>
                            Review submissions, approve or reject them, and move them back to pending whenever you need
                            to correct a decision.
                        </p>
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
                        <strong>{counts.total}</strong>
                    </article>
                    <article className={styles.statCard}>
                        <span>Pending</span>
                        <strong>{counts.pending}</strong>
                    </article>
                    <article className={styles.statCard}>
                        <span>Approved</span>
                        <strong>{counts.approved}</strong>
                    </article>
                    <article className={styles.statCard}>
                        <span>Rejected</span>
                        <strong>{counts.rejected}</strong>
                    </article>
                </div>

                <nav className={styles.tabBar} aria-label="Enquiry status tabs">
                    {statusTabs.map((tab) => {
                        const isActive = activeTab === tab.status;

                        return (
                            <button
                                key={tab.status}
                                type="button"
                                className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
                                onClick={() => setActiveTab(tab.status)}
                                aria-pressed={isActive}
                            >
                                <span>{tab.label}</span>
                                <strong>{counts[tab.status]}</strong>
                            </button>
                        );
                    })}
                </nav>

                {visibleEnquiries.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>{emptyStateCopy.title}</h2>
                        <p>{emptyStateCopy.description}</p>
                    </div>
                ) : (
                    <div className={styles.contentGrid}>
                        <div className={styles.listPanel}>
                            {visibleEnquiries.map((enquiry) => {
                                const isExpanded = enquiry.id === expandedId;
                                const status = statusConfig[enquiry.status];

                                return (
                                    <article key={enquiry.id} className={`${styles.enquiryCard} ${isExpanded ? styles.enquiryCardActive : ""}`}>
                                        <button
                                            type="button"
                                            className={styles.enquirySummary}
                                            onClick={() => setExpandedId(isExpanded ? null : enquiry.id)}
                                        >
                                            <div>
                                                <span className={styles.enquiryName}>
                                                    {enquiry.firstName} {enquiry.lastName}
                                                </span>
                                                <span className={styles.enquiryMeta}>{enquiry.publicationName}</span>
                                            </div>

                                            <div className={styles.enquirySummarySide}>
                                                <span className={`${styles.statusBadge} ${status.className}`}>{status.label}</span>
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
                                                        <dt>Role</dt>
                                                        <dd>{getRoleLabel(enquiry.role)}</dd>
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
                                                        <dt>Notes</dt>
                                                        <dd>{enquiry.notes || "Not provided"}</dd>
                                                    </div>
                                                </dl>

                                                {renderCardActions(enquiry)}
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
                                    <div className={styles.detailHeading}>
                                        <div>
                                            <h2>
                                                {selectedEnquiry.firstName} {selectedEnquiry.lastName}
                                            </h2>
                                            <p>{selectedEnquiry.publicationName}</p>
                                        </div>

                                        <span className={`${styles.statusBadge} ${statusConfig[selectedEnquiry.status].className}`}>
                                            {statusConfig[selectedEnquiry.status].label}
                                        </span>
                                    </div>

                                    <ul className={styles.detailList}>
                                        <li>
                                            <strong>Email:</strong> {selectedEnquiry.email}
                                        </li>
                                        <li>
                                            <strong>Role:</strong> {getRoleLabel(selectedEnquiry.role)}
                                        </li>
                                        <li>
                                            <strong>Region:</strong> {getRegionLabel(selectedEnquiry.region)}
                                        </li>
                                        <li>
                                            <strong>Submitted:</strong> {formatDate(selectedEnquiry.createdAt)}
                                        </li>
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

                                    {renderCardActions(selectedEnquiry)}
                                </>
                            ) : (
                                <p className={styles.detailEmpty}>Select an enquiry to view the full details.</p>
                            )}
                        </aside>
                    </div>
                )}

                <div className={styles.footerLink}>
                    <Link href="/media-signup">Open the public application page</Link>
                </div>
            </Container>
        </section>
    );
}
