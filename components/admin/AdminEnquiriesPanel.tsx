"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./AdminEnquiriesPanel.module.scss";

import { AdminPressReleaseRichTextEditor } from "@/components/admin/AdminPressReleaseRichTextEditor";
import { Button, FormControl, FormLabel, Input, Textarea } from "@/components/ui";
import { Container } from "@/components/layout";
import { ENQUIRY_STATUSES, type EnquiryRecord, type EnquiryStatus } from "@/lib/enquiry-types";
import { roleOptions, territoryOptions } from "@/lib/enquiry-options";
import { type ContactMessageAdminRecord } from "@/lib/contact-message-types";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import { editorInitialHtmlFromStored } from "@/lib/press-release-content-format";
import { releaseCardExcerpt, stripTagsToPlainText } from "@/lib/press-release-list-excerpt";

type PressReleaseQueueTab = "pending" | "approved" | "rejected";

type PressReleaseQueueCounts = Record<PressReleaseQueueTab, number>;

const PRESS_RELEASE_QUEUE_TABS: { id: PressReleaseQueueTab; label: string }[] = [
    { id: "pending", label: "Pending review" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
];

const PRESS_RELEASE_EDIT_CATEGORIES = [
    "Business",
    "Culture",
    "Education",
    "Environment",
    "Government",
    "Healthcare",
    "Technology",
    "Tourism",
] as const;

type PressReleaseEditModalState = {
    id: string;
    slug: string;
    status: string;
    paymentStatus: string;
    packageId: string;
    featuredUpgrade: boolean;
    featured: boolean;
    rejectionReason: string | null;
    summary: string;
    createdAt: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    organization: string;
    title: string;
    category: string;
    island: string;
    preferredDistributionDate: string;
    targetRegions: string;
    specialInstructions: string;
    outboundLink: string;
    content: string;
    coverImagePath: string | null;
    documentPath: string | null;
};

function resolveSubmissionAssetUrl(path: string | null): string | null {
    if (!path?.trim()) {
        return null;
    }

    const raw = path.trim();

    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    const base = (process.env.NEXT_PUBLIC_CARIB_BACKEND_URL || "").replace(/\/$/, "");
    const pathname = raw.startsWith("/") ? raw : `/${raw}`;

    return base ? `${base}${pathname}` : pathname;
}

function uploadPathFilename(path: string | null): string | null {
    if (!path?.trim()) {
        return null;
    }

    const segments = path.trim().split(/[/\\]/);

    return segments[segments.length - 1] ?? null;
}

const EDIT_RELEASE_COVER_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
const EDIT_RELEASE_DOCUMENT_ACCEPT =
    ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function mapReleaseToEditModal(release: PressReleaseRecord): PressReleaseEditModalState {
    return {
        id: release.id,
        slug: release.slug,
        status: release.status,
        paymentStatus: release.paymentStatus,
        packageId: release.packageId,
        featuredUpgrade: Boolean(release.featuredUpgrade),
        featured: Boolean(release.featured),
        rejectionReason: release.rejectionReason ?? null,
        summary: release.summary,
        createdAt: release.createdAt,
        fullName: release.fullName ?? "",
        email: release.email ?? "",
        phoneNumber: release.phoneNumber ?? "",
        organization: release.organization ?? "",
        title: release.title,
        category: release.category,
        island: release.island ?? "",
        preferredDistributionDate: (release.preferredDistributionDate ?? "").trim(),
        targetRegions: release.targetRegions ?? "",
        specialInstructions: release.specialInstructions ?? "",
        outboundLink: release.outboundLink ?? "",
        content: release.content,
        coverImagePath: release.coverImagePath,
        documentPath: release.documentPath ?? null,
    };
}

function preferredDateInputIsIso(value: string): boolean {
    return /^(\d{4}-\d{2}-\d{2})$/.test(value.trim());
}

type ToastState = {
    tone: "success" | "error";
    message: string;
};

type PortalInviteJobOutcome =
    | "created"
    | "skipped_exists"
    | "skipped_already_invited"
    | "skipped_rejected"
    | "skipped_not_found"
    | "skipped_invalid_email"
    | "failed";

type PortalInviteJobView = {
    id: string;
    status: "queued" | "processing" | "completed" | "failed";
    currentIndex: number;
    total: number;
    results: Array<{
        signupId: string;
        email: string;
        outcome: PortalInviteJobOutcome;
        detail?: string;
        userId?: string;
    }>;
    lastError: string | null;
};

type AdminEnquiriesPanelProps = {
    initialEnquiries: EnquiryRecord[];
    initialPressReleases?: PressReleaseRecord[];
    /** Total press releases matching the active admin filter (pagination). */
    initialPressReleaseTotal?: number;
    /** Paid-only queue totals for tab badges (all statuses, full database). */
    initialPressReleaseQueueCounts?: PressReleaseQueueCounts;
    initialLoadError?: string;
    initialPaymentGateway?: PaymentGateway | null;
    initialContactMessages?: ContactMessageAdminRecord[];
};

const ADMIN_PRESS_RELEASE_PAGE_SIZE = 8;

type StatusConfig = {
    label: string;
    description: string;
    className: string;
};

type PaymentGateway = {
    id: string;
    name: string;
    test_mode: boolean;
    environment: "sandbox" | "production";
    sandbox_configured: boolean;
    production_configured: boolean;
};

type AdminModule = "press-releases" | "media-signups" | "enquiries" | "payments" | "users" | "email-digest" | "analytics" | "site-access";

type PressSubmitterSubTab = "registered" | "contact-only";

const ADMIN_MODULE_HERO: Record<AdminModule, { kicker: string; title: string; description: string }> = {
    "press-releases": {
        kicker: "Press releases",
        title: "Review newsroom submissions",
        description:
            "Approve paid releases for the homepage and newsroom, toggle featured placement, and reject items that should not go live.",
    },
    "media-signups": {
        kicker: "Media signups",
        title: "Manage media signup enquiries",
        description:
            "Review applications from the early access form. Approve or reject them, queue portal invites to create accounts and email credentials, or move items back to pending to revisit a decision.",
    },
    enquiries: {
        kicker: "Enquiries",
        title: "Contact & proposal requests",
        description:
            "Messages from the public Contact Us form, including custom campaign inquiries from Pricing. Custom deals are agreed off-platform; use Portal members to invite contacts and assign credits after registration.",
    },
    payments: {
        kicker: "Payments",
        title: "Square checkout mode",
        description: "Switch between sandbox test mode and production charges for checkout.",
    },
    users: {
        kicker: "Portal members",
        title: "Members & proposal contacts",
        description:
            "Everyone with a portal login is listed the same way. Add credits for any account, and use contact-only rows to invite people who reached out before registering.",
    },
    "email-digest": {
        kicker: "Email digest",
        title: "Email digest",
        description: "Set digest cadence for subscribed users, or send the latest releases on demand.",
    },
    analytics: {
        kicker: "Analytics",
        title: "Performance overview",
        description: "Monthly submissions, revenue, approvals, portal member signups, and your most-viewed releases.",
    },
    "site-access": {
        kicker: "Security",
        title: "Public site access",
        description:
            "Turn IP restriction on or off (stored in DB). Allowed IPv4s are fixed in backend code. On Vercel the gate runs automatically; on AWS Amplify it runs when the app is built with amplify.yml (AMPLIFY_HOSTING). Else set SITE_IP_ALLOWLIST_ALWAYS_APPLY on the Next server. Locally use SITE_IP_ALLOWLIST_ENFORCE=true in .env.local only to test maintenance.",
    },
};

type AdminUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    organization: string | null;
    packageType: string | null;
    credits: number;
    bundleCreditsRemaining?: number;
    permanentCredits?: number;
    creditsExpiresAt: string | null;
    bundleCreditsExpiresAt?: string | null;
    totalSubmissions?: number;
    digestSubscribed?: boolean;
    createdAt: string;
    /** Optional profile payload (digest, media fields); not used to split member types in the admin UI. */
    journalistProfile?: unknown | null;
};

type DigestSettings = {
    frequency: "daily" | "3x-weekly";
    lastDigestSent: string | null;
    optedInJournalists: { name: string; email: string }[];
};

type AdminAnalytics = {
    totalSubmissionsThisMonth?: number;
    totalRevenueThisMonth?: number;
    totalApprovedThisMonth?: number;
    totalPortalMembersSignedUp?: number;
    topViewedReleases?: PressReleaseRecord[];
    revenueByPackage?: {
        single: { sales: number; revenue: number };
        bundle: { sales: number; revenue: number };
        featuredAddon: { sales: number; revenue: number };
    };
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

export default function AdminEnquiriesPanel({
    initialEnquiries,
    initialPressReleases = [],
    initialPressReleaseTotal,
    initialPressReleaseQueueCounts,
    initialLoadError,
    initialPaymentGateway = null,
    initialContactMessages = [],
}: AdminEnquiriesPanelProps) {
    const router = useRouter();
    const [enquiries, setEnquiries] = useState(initialEnquiries);
    const [pressReleases, setPressReleases] = useState(initialPressReleases);
    const [pressReleaseStatusTab, setPressReleaseStatusTab] = useState<PressReleaseQueueTab>("pending");
    const [pressReleaseQueueCounts, setPressReleaseQueueCounts] = useState<PressReleaseQueueCounts>(
        () => initialPressReleaseQueueCounts ?? { pending: 0, approved: 0, rejected: 0 }
    );
    const derivedInitialTotal =
        typeof initialPressReleaseTotal === "number"
            ? initialPressReleaseTotal
            : initialPressReleases.length;
    const [pressReleasePage, setPressReleasePage] = useState(1);
    const [pressReleaseTotalPages, setPressReleaseTotalPages] = useState(() =>
        Math.max(1, Math.ceil(derivedInitialTotal / ADMIN_PRESS_RELEASE_PAGE_SIZE))
    );
    const [pressReleaseTotalCount, setPressReleaseTotalCount] = useState(derivedInitialTotal);
    const [activeTab, setActiveTab] = useState<EnquiryStatus>("pending");
    const [expandedId, setExpandedId] = useState<string | null>(initialEnquiries.find((enquiry) => enquiry.status === "pending")?.id ?? initialEnquiries[0]?.id ?? null);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [statusAction, setStatusAction] = useState<{ id: string; status: EnquiryStatus } | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(initialPaymentGateway);
    const [isUpdatingPaymentMode, setIsUpdatingPaymentMode] = useState(false);
    const [isRefreshingPressReleases, setIsRefreshingPressReleases] = useState(false);
    const [pressReleaseAction, setPressReleaseAction] = useState<{ id: string; status: "pending" | "approved" | "rejected" } | null>(null);
    const [activeModule, setActiveModule] = useState<AdminModule>("press-releases");
    const [rejectModal, setRejectModal] = useState<{ id: string; title: string } | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [editModal, setEditModal] = useState<PressReleaseEditModalState | null>(null);
    const [editSaveBusy, setEditSaveBusy] = useState(false);
    const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
    const [editDocumentFile, setEditDocumentFile] = useState<File | null>(null);

    useEffect(() => {
        if (!editModal) {
            setEditCoverFile(null);
            setEditDocumentFile(null);
        }
    }, [editModal]);

    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [contactMessages, setContactMessages] = useState<ContactMessageAdminRecord[]>(initialContactMessages);
    const [pressSubmitterSubTab, setPressSubmitterSubTab] = useState<PressSubmitterSubTab>("registered");
    const [contactInviteSubmittingId, setContactInviteSubmittingId] = useState<string | null>(null);
    const [addCreditModalUser, setAddCreditModalUser] = useState<AdminUser | null>(null);
    const [addCreditAmountInput, setAddCreditAmountInput] = useState("1");
    const [addCreditBusy, setAddCreditBusy] = useState(false);
    const [isRefreshingContactMessages, setIsRefreshingContactMessages] = useState(false);
    const [registeredUserSearch, setRegisteredUserSearch] = useState("");
    const [digestSettings, setDigestSettings] = useState<DigestSettings | null>(null);
    const [digestSendBusy, setDigestSendBusy] = useState(false);
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [siteAccessSettings, setSiteAccessSettings] = useState<{
        enabled: boolean;
        entries: { label: string; ip: string }[];
    } | null>(null);
    const [siteAccessSaving, setSiteAccessSaving] = useState(false);
    const [portalInviteSubmittingId, setPortalInviteSubmittingId] = useState<string | null>(null);
    const [portalInviteAllBusy, setPortalInviteAllBusy] = useState(false);
    const [inviteJobId, setInviteJobId] = useState<string | null>(null);
    /** Shown in the top-right while a portal invite job is running (after queue until completion). */
    const [portalInviteProgress, setPortalInviteProgress] = useState<{ currentIndex: number; total: number } | null>(null);
    /** Which signup row triggered a single invite (for button label while job runs). */
    const [portalInviteRowId, setPortalInviteRowId] = useState<string | null>(null);
    const inviteTerminalHandledRef = useRef(false);

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

    const eligiblePortalInviteIds = useMemo(
        () => enquiries.filter((e) => !e.portalInvitedAt && e.status !== "rejected").map((e) => e.id),
        [enquiries],
    );

    /** Any email that already belongs to a portal account is excluded from “contact-only”. */
    const portalMemberEmailsLower = useMemo(() => {
        const set = new Set<string>();

        for (const user of adminUsers) {
            set.add(user.email.trim().toLowerCase());
        }

        return set;
    }, [adminUsers]);

    const contactOnlyProfiles = useMemo(
        () => contactMessages.filter((row) => !portalMemberEmailsLower.has(row.email.trim().toLowerCase())),
        [contactMessages, portalMemberEmailsLower],
    );

    const registeredUsersFiltered = useMemo(() => {
        const q = registeredUserSearch.trim().toLowerCase();

        if (!q) {
            return adminUsers;
        }

        return adminUsers.filter((user) => user.email.toLowerCase().includes(q));
    }, [adminUsers, registeredUserSearch]);

    function findPortalMemberByEmail(email: string): AdminUser | undefined {
        const needle = email.trim().toLowerCase();

        return adminUsers.find((u) => u.email.trim().toLowerCase() === needle);
    }

    const visibleEnquiries = useMemo(
        () => enquiries.filter((enquiry) => enquiry.status === activeTab),
        [enquiries, activeTab]
    );

    const pressReleaseEmptyCopy = useMemo(() => {
        if (pressReleaseStatusTab === "approved") {
            return {
                title: "No approved paid releases",
                description: "Approved submissions appear here. Use Pending review to approve items.",
            };
        }

        if (pressReleaseStatusTab === "rejected") {
            return {
                title: "No rejected paid releases",
                description: "Rejected submissions appear in this tab for your records.",
            };
        }

        return {
            title: "Nothing pending review",
            description: "Paid submissions that still need an approve or reject decision appear here.",
        };
    }, [pressReleaseStatusTab]);

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

    const heroCopy = ADMIN_MODULE_HERO[activeModule];
    const heroRefreshBusy =
        (activeModule === "media-signups" && isRefreshing) ||
        (activeModule === "enquiries" && isRefreshingContactMessages) ||
        (activeModule === "press-releases" && isRefreshingPressReleases) ||
        (activeModule === "site-access" && siteAccessSaving);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeoutId = window.setTimeout(() => setToast(null), 4000);

        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    useEffect(() => {
        if (!inviteJobId) {
            inviteTerminalHandledRef.current = false;
            setPortalInviteProgress(null);
            return;
        }

        inviteTerminalHandledRef.current = false;

        let stopped = false;
        let intervalId: ReturnType<typeof setInterval> | undefined;

        const poll = async () => {
            try {
                const res = await fetch(`/api/admin/media-signups/portal-invite-jobs/${inviteJobId}`, {
                    cache: "no-store",
                });
                const payload = await res.json().catch(() => null) as Record<string, unknown> | null;

                if (stopped || !payload?.success || !payload.data || typeof payload.data !== "object") {
                    return;
                }

                const raw = payload.data as Record<string, unknown>;
                const view: PortalInviteJobView = {
                    id: String(raw.id),
                    status: raw.status as PortalInviteJobView["status"],
                    currentIndex: Number(raw.currentIndex) || 0,
                    total: Number(raw.total) || 0,
                    results: Array.isArray(raw.results) ? raw.results as PortalInviteJobView["results"] : [],
                    lastError: raw.lastError === null || typeof raw.lastError === "string" ? raw.lastError as string | null : null,
                };

                if ((view.status === "completed" || view.status === "failed") && !inviteTerminalHandledRef.current) {
                    inviteTerminalHandledRef.current = true;

                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = undefined;
                    }

                    setPortalInviteProgress(null);
                    setPortalInviteRowId(null);

                    if (view.status === "completed") {
                        const created = view.results.filter((r) => r.outcome === "created").length;
                        const totalResults = view.results.length;
                        await refreshEnquiries({ showSuccessToast: false });
                        await reloadPortalMembersAndContacts();

                        if (created === 0) {
                            const first = view.results[0];
                            const reason = typeof first?.detail === "string" && first.detail
                                ? first.detail
                                : (typeof first?.outcome === "string" ? first.outcome : "No invitation could be sent.");
                            setToast({ tone: "error", message: reason });
                        } else if (totalResults === 1 && created === 1) {
                            setToast({ tone: "success", message: "Invitation sent successfully." });
                        } else {
                            setToast({
                                tone: "success",
                                message: `${created} invitation(s) sent successfully.`,
                            });
                        }
                    }

                    if (view.status === "failed") {
                        setToast({
                            tone: "error",
                            message: view.lastError || "Portal invite failed.",
                        });
                    }

                    setInviteJobId(null);
                } else {
                    const total = Math.max(1, view.total);
                    setPortalInviteProgress({
                        currentIndex: Math.min(view.currentIndex, total),
                        total,
                    });
                }
            } catch {
                // ignore transient network errors during polling
            }
        };

        void poll();
        intervalId = setInterval(poll, 2000);

        return () => {
            stopped = true;

            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [inviteJobId]);

    useEffect(() => {
        if (activeModule === "users" && adminUsers.length === 0) {
            fetch("/api/admin/users", { cache: "no-store" })
                .then((response) => response.ok ? response.json() : null)
                .then((payload) => setAdminUsers(Array.isArray(payload?.users) ? payload.users : []))
                .catch(() => null);
        }

        if (activeModule === "users" || activeModule === "enquiries") {
            void refreshContactMessages({ showSuccessToast: false });
        }

        if (activeModule === "email-digest" && !digestSettings) {
            fetch("/api/admin/digest-settings", { cache: "no-store" })
                .then((response) => response.ok ? response.json() : null)
                .then((payload) => {
                    if (!payload || typeof payload !== "object") {
                        setDigestSettings(null);
                        return;
                    }

                    setDigestSettings({
                        frequency: payload.frequency === "3x-weekly" ? "3x-weekly" : "daily",
                        lastDigestSent: typeof payload.lastDigestSent === "string" || payload.lastDigestSent === null
                            ? payload.lastDigestSent
                            : null,
                        optedInJournalists: Array.isArray(payload.optedInJournalists) ? payload.optedInJournalists : [],
                    });
                })
                .catch(() => null);
        }

        if (activeModule === "analytics" && !analytics) {
            fetch("/api/admin/analytics", { cache: "no-store" })
                .then((response) => response.ok ? response.json() : null)
                .then((payload) => setAnalytics(payload ?? null))
                .catch(() => null);
        }
    }, [activeModule, adminUsers.length, analytics, digestSettings]);

    useEffect(() => {
        if (activeModule !== "site-access") {
            return;
        }

        let cancelled = false;

        fetch("/api/admin/site-access", { cache: "no-store" })
            .then((response) => (response.ok ? response.json() : null))
            .then((payload) => {
                if (cancelled || !payload || typeof payload !== "object") {
                    if (!cancelled && (!payload || typeof payload !== "object")) {
                        setSiteAccessSettings(null);
                    }

                    return;
                }

                const entries = Array.isArray(payload.entries)
                    ? payload.entries
                        .filter((row: unknown) => row && typeof row === "object")
                        .map((row: { label?: unknown; ip?: unknown }) => ({
                            label: typeof row.label === "string" ? row.label : "",
                            ip: typeof row.ip === "string" ? row.ip : "",
                        }))
                        .filter((row: { ip: string }) => row.ip.length > 0)
                    : [];

                setSiteAccessSettings({
                    enabled: payload.enabled === true || payload.enabled === "true",
                    entries,
                });
            })
            .catch(() => {
                if (!cancelled) {
                    setSiteAccessSettings(null);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [activeModule]);

    async function refreshPaymentGateway(showToast = true) {
        try {
            const response = await fetch("/api/admin/payment-gateways", {
                method: "GET",
                cache: "no-store",
            });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                if (showToast) {
                    setToast({
                        tone: "error",
                        message: typeof payload?.error === "string" ? payload.error : "We could not load payment settings.",
                    });
                }
                return;
            }

            const gateway = Array.isArray(payload?.gateways) ? payload.gateways[0] : null;
            setPaymentGateway(gateway ?? null);
        } catch {
            if (showToast) {
                setToast({
                    tone: "error",
                    message: "We could not load payment settings right now.",
                });
            }
        }
    }

    async function togglePaymentTestMode() {
        if (!paymentGateway) {
            return;
        }

        setIsUpdatingPaymentMode(true);

        try {
            const response = await fetch("/api/admin/payment-gateways", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    testMode: !paymentGateway.test_mode,
                }),
            });
            const payload = await response.json().catch(() => null);

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            if (!response.ok) {
                setToast({
                    tone: "error",
                    message: typeof payload?.error === "string" ? payload.error : "We could not update Square mode.",
                });
                return;
            }

            await refreshPaymentGateway(false);
            setToast({
                tone: "success",
                message: !paymentGateway.test_mode ? "Square test mode enabled." : "Square production mode enabled.",
            });
        } catch {
            setToast({
                tone: "error",
                message: "We could not update Square mode right now.",
            });
        } finally {
            setIsUpdatingPaymentMode(false);
        }
    }

    async function refreshEnquiries(options: { showSuccessToast?: boolean } = {}) {
        const showSuccessToast = options.showSuccessToast !== false;
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

            if (showSuccessToast) {
                setToast({
                    tone: "success",
                    message: "Enquiries refreshed successfully.",
                });
            }
        } catch {
            setToast({
                tone: "error",
                message: "We could not refresh enquiries right now.",
            });
        } finally {
            setIsRefreshing(false);
        }
    }

    async function refreshContactMessages(options: { showSuccessToast?: boolean } = {}) {
        const showSuccessToast = options.showSuccessToast !== false;
        setIsRefreshingContactMessages(true);

        try {
            const response = await fetch("/api/admin/contact-messages", { cache: "no-store" });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setToast({
                    tone: "error",
                    message: typeof payload?.error === "string" ? payload.error : "We could not refresh contact enquiries.",
                });
                return;
            }

            setContactMessages(Array.isArray(payload?.contactMessages) ? payload.contactMessages : []);

            if (showSuccessToast) {
                setToast({ tone: "success", message: "Contact enquiries refreshed successfully." });
            }
        } catch {
            setToast({
                tone: "error",
                message: "We could not refresh contact enquiries right now.",
            });
        } finally {
            setIsRefreshingContactMessages(false);
        }
    }

    async function reloadPortalMembersAndContacts() {
        try {
            const [usersRes, contactRes] = await Promise.all([
                fetch("/api/admin/users", { cache: "no-store" }),
                fetch("/api/admin/contact-messages", { cache: "no-store" }),
            ]);

            if (usersRes.status === 401 || contactRes.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const usersPayload = await usersRes.json().catch(() => null) as { users?: AdminUser[] } | null;
            const contactPayload = await contactRes.json().catch(() => null) as { contactMessages?: ContactMessageAdminRecord[] } | null;

            if (usersRes.ok && Array.isArray(usersPayload?.users)) {
                setAdminUsers(usersPayload.users);
            }

            if (contactRes.ok && Array.isArray(contactPayload?.contactMessages)) {
                setContactMessages(contactPayload.contactMessages);
            }
        } catch {
            // background refresh from invite job
        }
    }

    async function startContactPortalInvite(contactId: string) {
        setContactInviteSubmittingId(contactId);

        try {
            const response = await fetch(`/api/admin/contact-messages/${contactId}/promote-portal-invite`, {
                method: "POST",
            });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null) as Record<string, unknown> | null;

            if (!response.ok) {
                const message = typeof payload?.message === "string"
                    ? payload.message
                    : typeof payload?.error === "string"
                        ? payload.error
                        : "We could not queue that portal invite.";
                setToast({ tone: "error", message });
                return;
            }

            const job = payload?.data as Record<string, unknown> | undefined;

            if (!job || typeof job.id !== "string") {
                setToast({ tone: "error", message: "Unexpected response from the server." });
                return;
            }

            const total = Math.max(1, Number(job.total) || 1);
            setPortalInviteProgress({ currentIndex: 0, total });
            setInviteJobId(job.id);
        } catch {
            setToast({ tone: "error", message: "We could not queue that portal invite right now." });
        } finally {
            setContactInviteSubmittingId(null);
        }
    }

    async function submitAddCredits() {
        if (!addCreditModalUser) {
            return;
        }

        const raw = Number.parseInt(addCreditAmountInput.trim(), 10);

        if (!Number.isFinite(raw) || raw < 1 || raw > 10_000) {
            setToast({ tone: "error", message: "Enter a whole number of credits between 1 and 10000." });
            return;
        }

        setAddCreditBusy(true);

        try {
            const response = await fetch(`/api/admin/users/${addCreditModalUser.id}/credits`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credits: raw }),
            });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null) as Record<string, unknown> | null;

            if (!response.ok) {
                const message = typeof payload?.message === "string"
                    ? payload.message
                    : typeof payload?.error === "string"
                        ? payload.error
                        : "We could not add credits.";
                setToast({ tone: "error", message });
                return;
            }

            const updated = payload?.data as { credits?: number } | undefined;

            setAdminUsers((current) =>
                current.map((u) =>
                    u.id === addCreditModalUser.id
                        ? { ...u, credits: typeof updated?.credits === "number" ? updated.credits : u.credits }
                        : u,
                ),
            );

            setAddCreditModalUser(null);
            setAddCreditAmountInput("1");
            setToast({ tone: "success", message: "Credits added successfully. A confirmation email is being sent in the background." });
        } catch {
            setToast({ tone: "error", message: "We could not add credits right now." });
        } finally {
            setAddCreditBusy(false);
        }
    }

    async function startPortalInviteForIds(signupIds: string[], context: "single" | "bulk") {
        if (signupIds.length === 0) {
            setToast({ tone: "error", message: "No eligible signups selected." });
            return;
        }

        if (context === "single") {
            setPortalInviteRowId(signupIds[0] ?? null);
            setPortalInviteSubmittingId(signupIds[0] ?? null);
        } else {
            setPortalInviteRowId(null);
            setPortalInviteAllBusy(true);
        }

        let jobQueued = false;

        try {
            const response = await fetch("/api/admin/media-signups/portal-invite-jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ signupIds }),
            });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null) as Record<string, unknown> | null;

            if (!response.ok) {
                const message = typeof payload?.message === "string"
                    ? payload.message
                    : typeof payload?.error === "string"
                        ? payload.error
                        : "We could not queue portal invites.";
                setToast({ tone: "error", message });
                return;
            }

            const job = payload?.data as PortalInviteJobView | undefined;

            if (!job?.id) {
                setToast({ tone: "error", message: "Unexpected response from the server." });
                return;
            }

            const total = Math.max(1, Number(job.total) || signupIds.length);
            setPortalInviteProgress({ currentIndex: 0, total });
            setInviteJobId(job.id);
            jobQueued = true;
        } catch {
            setToast({ tone: "error", message: "We could not queue portal invites right now." });
        } finally {
            setPortalInviteSubmittingId(null);
            setPortalInviteAllBusy(false);

            if (!jobQueued) {
                setPortalInviteRowId(null);
            }
        }
    }

    async function handleBulkPortalInvite() {
        if (eligiblePortalInviteIds.length === 0) {
            setToast({ tone: "error", message: "No eligible signups (not rejected, not already invited)." });
            return;
        }

        await startPortalInviteForIds(eligiblePortalInviteIds, "bulk");
    }

    async function refreshPressReleases(showToast = true, page = pressReleasePage, statusTab: PressReleaseQueueTab = pressReleaseStatusTab) {
        setIsRefreshingPressReleases(true);

        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(ADMIN_PRESS_RELEASE_PAGE_SIZE),
                status: statusTab,
            });
            const response = await fetch(`/api/admin/press-releases?${params.toString()}`, {
                method: "GET",
                cache: "no-store",
            });

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                if (showToast) {
                    setToast({
                        tone: "error",
                        message: typeof payload?.error === "string" ? payload.error : "We could not refresh press releases.",
                    });
                }
                return;
            }

            const releases = Array.isArray(payload?.releases) ? payload.releases : [];
            setPressReleases(releases);

            const meta = payload?.meta as Record<string, unknown> | undefined;
            if (meta && typeof meta.totalPages === "number") {
                setPressReleaseTotalPages(Math.max(1, meta.totalPages));
            }
            if (meta && typeof meta.total === "number") {
                setPressReleaseTotalCount(meta.total);
            }
            const paidQueue = meta?.paidQueueCounts as PressReleaseQueueCounts | undefined;
            if (paidQueue && typeof paidQueue.pending === "number" && typeof paidQueue.approved === "number" && typeof paidQueue.rejected === "number") {
                setPressReleaseQueueCounts(paidQueue);
            }
            setPressReleasePage(page);
            setPressReleaseStatusTab(statusTab);

            if (showToast) {
                setToast({
                    tone: "success",
                    message: "Press releases refreshed successfully.",
                });
            }
        } catch {
            if (showToast) {
                setToast({
                    tone: "error",
                    message: "We could not refresh press releases right now.",
                });
            }
        } finally {
            setIsRefreshingPressReleases(false);
        }
    }

    function goToPressReleasePage(nextPage: number) {
        const clamped = Math.min(Math.max(1, nextPage), pressReleaseTotalPages);
        if (clamped === pressReleasePage) {
            return;
        }

        void refreshPressReleases(false, clamped, pressReleaseStatusTab);
    }

    async function handleHeroRefresh() {
        switch (activeModule) {
            case "media-signups":
                await refreshEnquiries();
                return;
            case "press-releases":
                await refreshPressReleases();
                return;
            case "payments":
                await refreshPaymentGateway();
                return;
            case "users": {
                try {
                    const response = await fetch("/api/admin/users", { cache: "no-store" });
                    if (response.status === 401) {
                        router.replace("/admin/login");
                        return;
                    }

                    const payload = await response.json().catch(() => null);
                    if (!response.ok) {
                        setToast({
                            tone: "error",
                            message: typeof payload?.error === "string" ? payload.error : "We could not refresh users.",
                        });
                        return;
                    }

                    setAdminUsers(Array.isArray(payload?.users) ? payload.users : []);
                    await refreshContactMessages({ showSuccessToast: false });
                    setToast({ tone: "success", message: "Portal members refreshed." });
                } catch {
                    setToast({ tone: "error", message: "We could not refresh users right now." });
                }

                return;
            }
            case "enquiries":
                await refreshContactMessages();
                return;
            case "email-digest": {
                try {
                    const response = await fetch("/api/admin/digest-settings", { cache: "no-store" });
                    if (response.status === 401) {
                        router.replace("/admin/login");
                        return;
                    }

                    const payload = await response.json().catch(() => null);
                    if (!response.ok) {
                        setToast({
                            tone: "error",
                            message: typeof payload?.error === "string" ? payload.error : "We could not refresh digest settings.",
                        });
                        return;
                    }

                    if (!payload || typeof payload !== "object") {
                        setDigestSettings(null);
                    } else {
                        setDigestSettings({
                            frequency: payload.frequency === "3x-weekly" ? "3x-weekly" : "daily",
                            lastDigestSent: typeof payload.lastDigestSent === "string" || payload.lastDigestSent === null
                                ? payload.lastDigestSent
                                : null,
                            optedInJournalists: Array.isArray(payload.optedInJournalists) ? payload.optedInJournalists : [],
                        });
                    }
                    setToast({ tone: "success", message: "Digest settings refreshed." });
                } catch {
                    setToast({ tone: "error", message: "We could not refresh digest settings." });
                }

                return;
            }
            case "analytics": {
                try {
                    const response = await fetch("/api/admin/analytics", { cache: "no-store" });
                    if (response.status === 401) {
                        router.replace("/admin/login");
                        return;
                    }

                    const payload = await response.json().catch(() => null);
                    if (!response.ok) {
                        setToast({
                            tone: "error",
                            message: typeof payload?.error === "string" ? payload.error : "We could not refresh analytics.",
                        });
                        return;
                    }

                    setAnalytics(payload ?? null);
                    setToast({ tone: "success", message: "Analytics refreshed." });
                } catch {
                    setToast({ tone: "error", message: "We could not refresh analytics." });
                }

                return;
            }
            case "site-access": {
                try {
                    const response = await fetch("/api/admin/site-access", { cache: "no-store" });

                    if (response.status === 401) {
                        router.replace("/admin/login");
                        return;
                    }

                    const payload = await response.json().catch(() => null);

                    if (!response.ok) {
                        setToast({
                            tone: "error",
                            message: typeof payload?.error === "string"
                                ? payload.error
                                : "We could not refresh site access settings.",
                        });
                        return;
                    }

                    if (!payload || typeof payload !== "object") {
                        setSiteAccessSettings(null);
                    } else {
                        const entries = Array.isArray(payload.entries)
                            ? payload.entries
                                .filter((row: unknown) => row && typeof row === "object")
                                .map((row: { label?: unknown; ip?: unknown }) => ({
                                    label: typeof row.label === "string" ? row.label : "",
                                    ip: typeof row.ip === "string" ? row.ip : "",
                                }))
                                .filter((row: { ip: string }) => row.ip.length > 0)
                            : [];

                        setSiteAccessSettings({
                            enabled: payload.enabled === true || payload.enabled === "true",
                            entries,
                        });
                    }

                    setToast({ tone: "success", message: "Site access settings refreshed." });
                } catch {
                    setToast({ tone: "error", message: "We could not refresh site access settings." });
                }

                return;
            }
            default:
        }
    }

    async function syncPressReleaseStatus(releaseId: string, nextStatus: "pending" | "approved" | "rejected", reason = "") {
        setPressReleaseAction({ id: releaseId, status: nextStatus });

        try {
            const response = await fetch(`/api/admin/press-releases/${releaseId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: nextStatus,
                    rejectionReason: reason,
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
                    message: typeof payload?.error === "string" ? payload.error : "We could not update that press release.",
                });
                return;
            }

            await refreshPressReleases(false, 1, pressReleaseStatusTab);

            setToast({
                tone: "success",
                message:
                    nextStatus === "approved"
                        ? "Press release approved successfully."
                        : "Press release rejected successfully.",
            });
        } catch {
            setToast({
                tone: "error",
                message: "We could not update that press release right now.",
            });
        } finally {
            setPressReleaseAction(null);
        }
    }

    async function confirmRejectPressRelease() {
        if (!rejectModal) {
            return;
        }

        await syncPressReleaseStatus(rejectModal.id, "rejected", rejectionReason);
        setRejectModal(null);
        setRejectionReason("");
    }

    async function toggleFeaturedPressRelease(release: PressReleaseRecord) {
        const response = await fetch(`/api/admin/press-releases/${release.id}/feature`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ featured: !release.featured }),
        });
        const payload = await response.json().catch(() => null);

        if (response.ok && payload?.release) {
            setPressReleases((current) => current.map((item) => item.id === release.id ? payload.release : item));
        } else {
            setToast({ tone: "error", message: typeof payload?.error === "string" ? payload.error : "Feature setting could not be updated." });
        }
    }

    async function savePressReleaseEdits() {
        if (!editModal || editSaveBusy) {
            return;
        }

        setEditSaveBusy(true);

        try {
            const response = await fetch(`/api/admin/press-releases/${editModal.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: editModal.fullName,
                    email: editModal.email,
                    phoneNumber: editModal.phoneNumber,
                    organization: editModal.organization,
                    title: editModal.title,
                    category: editModal.category,
                    island: editModal.island,
                    preferredDistributionDate: editModal.preferredDistributionDate,
                    targetRegions: editModal.targetRegions,
                    specialInstructions: editModal.specialInstructions,
                    outboundLink: editModal.outboundLink,
                    content: editModal.content,
                }),
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok || !payload?.release) {
                setToast({
                    tone: "error",
                    message:
                        typeof payload?.error === "string"
                            ? payload.error
                            : typeof payload?.message === "string"
                              ? payload.message
                              : "Press release could not be updated.",
                });

                return;
            }

            let mergedRelease = payload.release as PressReleaseRecord;

            if (editCoverFile || editDocumentFile) {
                const formData = new FormData();

                if (editCoverFile) {
                    formData.append("coverPhoto", editCoverFile);
                }

                if (editDocumentFile) {
                    formData.append("document", editDocumentFile);
                }

                const fileResponse = await fetch(`/api/admin/press-releases/${editModal.id}/files`, {
                    method: "PUT",
                    body: formData,
                });
                const filePayload = await fileResponse.json().catch(() => null);

                if (!fileResponse.ok || !filePayload?.release) {
                    setToast({
                        tone: "error",
                        message:
                            typeof filePayload?.error === "string"
                                ? filePayload.error
                                : typeof filePayload?.message === "string"
                                  ? filePayload.message
                                  : "Text saved, but file upload failed. Try again.",
                    });
                    setEditModal(mapReleaseToEditModal(mergedRelease));
                    setEditCoverFile(null);
                    setEditDocumentFile(null);
                    await refreshPressReleases(false, pressReleasePage, pressReleaseStatusTab);

                    return;
                }

                mergedRelease = filePayload.release as PressReleaseRecord;
            }

            setEditModal(null);
            setEditCoverFile(null);
            setEditDocumentFile(null);
            setToast({ tone: "success", message: "Press release updated successfully." });
            await refreshPressReleases(false, pressReleasePage, pressReleaseStatusTab);
        } catch {
            setToast({ tone: "error", message: "Network error while saving." });
        } finally {
            setEditSaveBusy(false);
        }
    }

    async function saveDigestFrequency() {
        const frequency = digestSettings?.frequency ?? "daily";
        const response = await fetch("/api/admin/digest-settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ frequency }),
        });

        if (response.ok) {
            const refresh = await fetch("/api/admin/digest-settings", { cache: "no-store" });
            const payload = await refresh.json().catch(() => null);
            if (refresh.ok && payload && typeof payload === "object") {
                setDigestSettings({
                    frequency: payload.frequency === "3x-weekly" ? "3x-weekly" : "daily",
                    lastDigestSent: typeof payload.lastDigestSent === "string" || payload.lastDigestSent === null
                        ? payload.lastDigestSent
                        : null,
                    optedInJournalists: Array.isArray(payload.optedInJournalists) ? payload.optedInJournalists : [],
                });
            }
            setToast({ tone: "success", message: "Digest frequency saved." });
        }
    }

    async function saveSiteAccess() {
        if (!siteAccessSettings) {
            return;
        }

        setSiteAccessSaving(true);

        try {
            const response = await fetch("/api/admin/site-access", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enabled: siteAccessSettings.enabled,
                }),
            });
            const payload = await response.json().catch(() => null) as Record<string, unknown> | null;

            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }

            if (!response.ok) {
                setToast({
                    tone: "error",
                    message: typeof payload?.error === "string"
                        ? payload.error
                        : "Site access settings could not be saved.",
                });
                return;
            }

            if (payload && typeof payload === "object" && Array.isArray(payload.entries)) {
                setSiteAccessSettings({
                    enabled: payload.enabled === true || payload.enabled === "true",
                    entries: (payload.entries as unknown[])
                        .filter((row: unknown) => row && typeof row === "object")
                        .map((row) => {
                            const r = row as { label?: unknown; ip?: unknown };
                            return {
                                label: typeof r.label === "string" ? r.label : "",
                                ip: typeof r.ip === "string" ? r.ip : "",
                            };
                        })
                        .filter((row: { ip: string }) => row.ip.length > 0),
                });
            }

            setToast({ tone: "success", message: "Site access settings saved." });
        } catch {
            setToast({ tone: "error", message: "Site access settings could not be saved right now." });
        } finally {
            setSiteAccessSaving(false);
        }
    }

    async function sendDigestNow() {
        if (digestSendBusy) {
            return;
        }
        setDigestSendBusy(true);
        try {
            const response = await fetch("/api/admin/email-digests/send", { method: "POST" });
            const payload = await response.json().catch(() => null) as {
                skipped?: boolean;
                recipients?: number;
            } | null;

            if (response.ok) {
                if (payload?.skipped) {
                    setToast({ tone: "success", message: "Digest skipped: no opted-in users or no approved releases." });
                } else {
                    setToast({ tone: "success", message: `Digest sent to ${payload?.recipients ?? 0} users.` });
                }

                const refresh = await fetch("/api/admin/digest-settings", { cache: "no-store" });
                const settingsPayload = await refresh.json().catch(() => null);
                if (refresh.ok && settingsPayload && typeof settingsPayload === "object") {
                    setDigestSettings({
                        frequency: settingsPayload.frequency === "3x-weekly" ? "3x-weekly" : "daily",
                        lastDigestSent: typeof settingsPayload.lastDigestSent === "string" || settingsPayload.lastDigestSent === null
                            ? settingsPayload.lastDigestSent
                            : null,
                        optedInJournalists: Array.isArray(settingsPayload.optedInJournalists) ? settingsPayload.optedInJournalists : [],
                    });
                }
            } else {
                setToast({ tone: "error", message: "Digest could not be sent." });
            }
        } catch {
            setToast({ tone: "error", message: "Digest could not be sent." });
        } finally {
            setDigestSendBusy(false);
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
        const canPortalInvite = !enquiry.portalInvitedAt && enquiry.status !== "rejected";
        const inviteBusy =
            portalInviteSubmittingId === enquiry.id
            || portalInviteAllBusy
            || inviteJobId !== null;
        const inviteButtonLabel = (() => {
            if (portalInviteSubmittingId === enquiry.id) {
                return "Queueing…";
            }

            if (inviteJobId && portalInviteRowId === enquiry.id) {
                return "Sending…";
            }

            if (inviteJobId) {
                return "Please wait…";
            }

            return "Invite to portal";
        })();

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
                                disabled={actionBusy || deletingId === enquiry.id || inviteBusy}
                            >
                                {actionBusy && statusAction?.status === "approved" ? "Approving..." : "Approve"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => syncStatusChange(enquiry.id, "rejected")}
                                disabled={actionBusy || deletingId === enquiry.id || inviteBusy}
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
                            disabled={actionBusy || deletingId === enquiry.id || inviteBusy}
                        >
                            {actionBusy && statusAction?.status === "pending"
                                ? getActionLoadingLabel(enquiry.status)
                                : getActionLabel(enquiry.status)}
                        </Button>
                    )}

                    {canPortalInvite ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => {
                                void startPortalInviteForIds([enquiry.id], "single");
                            }}
                            disabled={inviteBusy || actionBusy || deletingId === enquiry.id}
                        >
                            {inviteButtonLabel}
                        </Button>
                    ) : null}

                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => handleDelete(enquiry.id)}
                        disabled={deletingId === enquiry.id || actionBusy || inviteBusy}
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

            {portalInviteProgress ? (
                <div
                    className={styles.portalInviteIndicator}
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                >
                    <span className={styles.portalInviteSpinner} aria-hidden />
                    <div className={styles.portalInviteIndicatorBody}>
                        <span className={styles.portalInviteIndicatorTitle}>
                            {portalInviteProgress.total > 1 ? "Sending invitations…" : "Sending invitation…"}
                        </span>
                        {portalInviteProgress.total > 1 ? (
                            <span className={styles.portalInviteIndicatorMeta}>
                                {portalInviteProgress.currentIndex} / {portalInviteProgress.total}
                            </span>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {digestSendBusy ? (
                <div
                    className={`${styles.portalInviteIndicator} ${styles.digestSendLayer}`}
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                >
                    <span className={styles.portalInviteSpinner} aria-hidden />
                    <div className={styles.portalInviteIndicatorBody}>
                        <span className={styles.portalInviteIndicatorTitle}>Sending digest…</span>
                        <span className={styles.portalInviteIndicatorMeta}>
                            Processing on the server; you can keep working here.
                        </span>
                    </div>
                </div>
            ) : null}

            <Container className={styles.adminPanelInner}>
                <div className={styles.hero}>
                    <div>
                        <span className={styles.kicker}>{heroCopy.kicker}</span>
                        <h1>{heroCopy.title}</h1>
                        <p>{heroCopy.description}</p>
                    </div>

                    <div className={styles.heroActions}>
                        {activeModule === "media-signups" ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => {
                                    void handleBulkPortalInvite();
                                }}
                                disabled={
                                    portalInviteAllBusy
                                    || portalInviteSubmittingId !== null
                                    || inviteJobId !== null
                                    || eligiblePortalInviteIds.length === 0
                                    || heroRefreshBusy
                                }
                            >
                                {portalInviteAllBusy || inviteJobId
                                    ? "Sending…"
                                    : `Queue portal invites (${eligiblePortalInviteIds.length})`}
                            </Button>
                        ) : null}
                        <Button type="button" variant="secondary" size="md" onClick={handleHeroRefresh} disabled={heroRefreshBusy}>
                            {heroRefreshBusy ? "Refreshing..." : "Refresh"}
                        </Button>
                        <Button type="button" variant="primary" size="md" onClick={handleLogout} disabled={isLoggingOut}>
                            {isLoggingOut ? "Signing out..." : "Sign out"}
                        </Button>
                    </div>
                </div>

                {rejectModal ? (
                    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
                        <div className={styles.rejectModal}>
                            <h2>Reject press release</h2>
                            <p>{stripTagsToPlainText(rejectModal.title)}</p>
                            <label htmlFor="press-release-rejection-reason">Enter reason for rejection (optional)</label>
                            <textarea
                                id="press-release-rejection-reason"
                                value={rejectionReason}
                                onChange={(event) => setRejectionReason(event.target.value)}
                                rows={5}
                            />
                            <div className={styles.actionGroup}>
                                <Button type="button" variant="outline" size="md" onClick={() => {
                                    setRejectModal(null);
                                    setRejectionReason("");
                                }}>
                                    Cancel
                                </Button>
                                <Button type="button" variant="primary" size="md" onClick={confirmRejectPressRelease} disabled={pressReleaseAction?.id === rejectModal.id}>
                                    {pressReleaseAction?.id === rejectModal.id ? "Rejecting..." : "Confirm Reject"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {addCreditModalUser ? (
                    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="add-credits-heading">
                        <div className={styles.rejectModal}>
                            <h2 id="add-credits-heading">Add distribution credits</h2>
                            <p>
                                {addCreditModalUser.firstName} {addCreditModalUser.lastName} ({addCreditModalUser.email})
                            </p>
                            <FormControl>
                                <FormLabel htmlFor="admin-add-credits-amount">Number of credits</FormLabel>
                                <Input
                                    id="admin-add-credits-amount"
                                    name="credits"
                                    type="number"
                                    min={1}
                                    max={10_000}
                                    value={addCreditAmountInput}
                                    onChange={(event) => setAddCreditAmountInput(event.target.value)}
                                />
                            </FormControl>
                            <div className={styles.actionGroup}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="md"
                                    onClick={() => {
                                        setAddCreditModalUser(null);
                                        setAddCreditAmountInput("1");
                                    }}
                                    disabled={addCreditBusy}
                                >
                                    Cancel
                                </Button>
                                <Button type="button" variant="primary" size="md" onClick={() => void submitAddCredits()} disabled={addCreditBusy}>
                                    {addCreditBusy ? "Saving…" : "Add credits"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {editModal ? (
                    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="edit-release-heading">
                        <div className={styles.editReleaseModal}>
                            <div className={styles.editReleaseModalHeader}>
                                <div className={styles.editReleaseModalHeaderText}>
                                    <h2 id="edit-release-heading">Review & edit submission</h2>
                                    <p className={styles.editReleaseModalIntro}>
                                        Everything the submitter entered on the release form. Save at any time; if you change the title, the public URL slug updates when needed.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className={styles.editReleaseModalClose}
                                    onClick={() => setEditModal(null)}
                                    aria-label="Close dialog"
                                    disabled={editSaveBusy}
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <div className={styles.editReleaseModalFields}>
                                <div className={styles.editReleaseSection}>
                                    <h3 className={styles.editReleaseSectionTitle}>Status & routing</h3>
                                    <dl className={styles.editReleaseMetaGrid}>
                                        <div>
                                            <dt>Slug</dt>
                                            <dd>{editModal.slug}</dd>
                                        </div>
                                        <div>
                                            <dt>Status</dt>
                                            <dd>{editModal.status}</dd>
                                        </div>
                                        <div>
                                            <dt>Payment</dt>
                                            <dd>{editModal.paymentStatus}</dd>
                                        </div>
                                        <div>
                                            <dt>Package</dt>
                                            <dd>{editModal.packageId}</dd>
                                        </div>
                                        <div>
                                            <dt>Featured upgrade</dt>
                                            <dd>{editModal.featuredUpgrade ? "Yes" : "No"}</dd>
                                        </div>
                                        <div>
                                            <dt>Featured slot</dt>
                                            <dd>{editModal.featured ? "On" : "Off"}</dd>
                                        </div>
                                        <div>
                                            <dt>Submitted</dt>
                                            <dd>{new Date(editModal.createdAt).toLocaleString()}</dd>
                                        </div>
                                    </dl>
                                    {editModal.status === "approved" ? (
                                        <p className={styles.editReleaseInlineLink}>
                                            <Link href={`/newsroom/${editModal.slug}`} target="_blank" rel="noreferrer">
                                                Open public newsroom page
                                            </Link>
                                        </p>
                                    ) : null}
                                    {editModal.rejectionReason ? (
                                        <p className={styles.editReleaseRejectionNote}>
                                            <strong>Rejection reason:</strong> {editModal.rejectionReason}
                                        </p>
                                    ) : null}
                                </div>

                                <div className={styles.editReleaseSection}>
                                    <h3 className={styles.editReleaseSectionTitle}>Submitter</h3>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-full-name">Full name</FormLabel>
                                        <Input
                                            id="edit-release-full-name"
                                            value={editModal.fullName}
                                            onChange={(event) => setEditModal({ ...editModal, fullName: event.target.value })}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-email">Email</FormLabel>
                                        <Input
                                            id="edit-release-email"
                                            type="email"
                                            value={editModal.email}
                                            onChange={(event) => setEditModal({ ...editModal, email: event.target.value })}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-phone">Phone</FormLabel>
                                        <Input
                                            id="edit-release-phone"
                                            value={editModal.phoneNumber}
                                            onChange={(event) => setEditModal({ ...editModal, phoneNumber: event.target.value })}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-organization">Organization</FormLabel>
                                        <Input
                                            id="edit-release-organization"
                                            value={editModal.organization}
                                            onChange={(event) => setEditModal({ ...editModal, organization: event.target.value })}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                </div>

                                <div className={styles.editReleaseSection}>
                                    <h3 className={styles.editReleaseSectionTitle}>Release details</h3>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-title">Release title</FormLabel>
                                        <Input
                                            id="edit-release-title"
                                            value={editModal.title}
                                            onChange={(event) => setEditModal({ ...editModal, title: event.target.value })}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-category">Category</FormLabel>
                                        <select
                                            id="edit-release-category"
                                            className={styles.editReleaseSelect}
                                            value={editModal.category}
                                            onChange={(event) => setEditModal({ ...editModal, category: event.target.value })}
                                        >
                                            <option value="">Select category</option>
                                            {PRESS_RELEASE_EDIT_CATEGORIES.includes(
                                                editModal.category as (typeof PRESS_RELEASE_EDIT_CATEGORIES)[number],
                                            ) ? null : editModal.category ? (
                                                <option value={editModal.category}>{editModal.category}</option>
                                            ) : null}
                                            {PRESS_RELEASE_EDIT_CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-island">Region / island</FormLabel>
                                        <Input
                                            id="edit-release-island"
                                            value={editModal.island}
                                            onChange={(event) => setEditModal({ ...editModal, island: event.target.value })}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-preferred-date">Preferred distribution date</FormLabel>
                                        {preferredDateInputIsIso(editModal.preferredDistributionDate) || !editModal.preferredDistributionDate.trim() ? (
                                            <Input
                                                id="edit-release-preferred-date"
                                                type="date"
                                                value={editModal.preferredDistributionDate}
                                                onChange={(event) =>
                                                    setEditModal({ ...editModal, preferredDistributionDate: event.target.value })
                                                }
                                                autoComplete="off"
                                            />
                                        ) : (
                                            <>
                                                <Input
                                                    id="edit-release-preferred-date"
                                                    type="text"
                                                    value={editModal.preferredDistributionDate}
                                                    onChange={(event) =>
                                                        setEditModal({ ...editModal, preferredDistributionDate: event.target.value })
                                                    }
                                                    autoComplete="off"
                                                />
                                                <p className={styles.editReleaseFieldNote}>
                                                    Stored as free text. Switch to YYYY-MM-DD if you want the calendar picker.
                                                </p>
                                            </>
                                        )}
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-target-regions">Target regions</FormLabel>
                                        <Textarea
                                            id="edit-release-target-regions"
                                            value={editModal.targetRegions}
                                            onChange={(event) => setEditModal({ ...editModal, targetRegions: event.target.value })}
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-special">Special instructions</FormLabel>
                                        <Textarea
                                            id="edit-release-special"
                                            value={editModal.specialInstructions}
                                            onChange={(event) => setEditModal({ ...editModal, specialInstructions: event.target.value })}
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-outbound-link">Outbound link (optional)</FormLabel>
                                        <Input
                                            id="edit-release-outbound-link"
                                            type="url"
                                            inputMode="url"
                                            autoComplete="url"
                                            placeholder="https://yourwebsite.com"
                                            value={editModal.outboundLink}
                                            onChange={(event) => setEditModal({ ...editModal, outboundLink: event.target.value })}
                                        />
                                    </FormControl>
                                </div>

                                <div className={styles.editReleaseSection}>
                                    <h3 className={styles.editReleaseSectionTitle}>Uploaded files</h3>
                                    <div className={styles.editReleaseFileRows}>
                                        <div className={styles.editReleaseFileRow}>
                                            <div className={styles.editReleaseFilePreview}>
                                                {resolveSubmissionAssetUrl(editModal.coverImagePath) ? (
                                                    <img
                                                        className={styles.editReleaseCoverThumb}
                                                        src={resolveSubmissionAssetUrl(editModal.coverImagePath) ?? ""}
                                                        alt="Current cover"
                                                    />
                                                ) : (
                                                    <div className={styles.editReleaseFilePlaceholder}>No cover image</div>
                                                )}
                                            </div>
                                            <div className={styles.editReleaseFileMeta}>
                                                <p className={styles.editReleaseAssetLabel}>Cover image</p>
                                                {uploadPathFilename(editModal.coverImagePath) ? (
                                                    <p className={styles.editReleaseFileName}>
                                                        On file: {uploadPathFilename(editModal.coverImagePath)}
                                                    </p>
                                                ) : null}
                                                {resolveSubmissionAssetUrl(editModal.coverImagePath) ? (
                                                    <a
                                                        href={resolveSubmissionAssetUrl(editModal.coverImagePath) ?? "#"}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={styles.editReleaseAssetLink}
                                                    >
                                                        Open current file
                                                    </a>
                                                ) : null}
                                                <span className={styles.editReleaseFileInputLabel}>Replace cover</span>
                                                <input
                                                    type="file"
                                                    accept={EDIT_RELEASE_COVER_ACCEPT}
                                                    className={styles.editReleaseFileInputNative}
                                                    onChange={(event) => setEditCoverFile(event.target.files?.[0] ?? null)}
                                                />
                                                {editCoverFile ? (
                                                    <p className={styles.editReleaseFileSelected}>Selected: {editCoverFile.name}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className={styles.editReleaseFileRow}>
                                            <div className={styles.editReleaseFilePreview}>
                                                <div className={styles.editReleaseDocBadge} aria-hidden="true">DOC</div>
                                            </div>
                                            <div className={styles.editReleaseFileMeta}>
                                                <p className={styles.editReleaseAssetLabel}>Attached document</p>
                                                {uploadPathFilename(editModal.documentPath) ? (
                                                    <p className={styles.editReleaseFileName}>
                                                        On file: {uploadPathFilename(editModal.documentPath)}
                                                    </p>
                                                ) : (
                                                    <p className={styles.editReleaseFileName}>No document on file.</p>
                                                )}
                                                {resolveSubmissionAssetUrl(editModal.documentPath) ? (
                                                    <a
                                                        href={resolveSubmissionAssetUrl(editModal.documentPath) ?? "#"}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={styles.editReleaseAssetLink}
                                                    >
                                                        Download current file
                                                    </a>
                                                ) : null}
                                                <span className={styles.editReleaseFileInputLabel}>Replace document</span>
                                                <input
                                                    type="file"
                                                    accept={EDIT_RELEASE_DOCUMENT_ACCEPT}
                                                    className={styles.editReleaseFileInputNative}
                                                    onChange={(event) => setEditDocumentFile(event.target.files?.[0] ?? null)}
                                                />
                                                {editDocumentFile ? (
                                                    <p className={styles.editReleaseFileSelected}>Selected: {editDocumentFile.name}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.editReleaseSection}>
                                    <FormControl>
                                        <FormLabel htmlFor="edit-release-content">Press release content</FormLabel>
                                        <AdminPressReleaseRichTextEditor
                                            key={editModal.id}
                                            releaseId={editModal.id}
                                            initialHtml={editorInitialHtmlFromStored(editModal.content)}
                                            disabled={editSaveBusy}
                                            onChange={(html) => setEditModal((m) => (m ? { ...m, content: html } : m))}
                                        />
                                    </FormControl>
                                </div>
                            </div>
                            <div className={styles.actionGroup}>
                                <Button type="button" variant="outline" size="md" onClick={() => setEditModal(null)} disabled={editSaveBusy}>
                                    Cancel
                                </Button>
                                <Button type="button" variant="primary" size="md" onClick={savePressReleaseEdits} disabled={editSaveBusy}>
                                    {editSaveBusy ? "Saving…" : "Save changes"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className={styles.adminShell}>
                    <aside className={styles.sidebar} aria-label="Admin modules">
                        <button
                            type="button"
                            className={activeModule === "press-releases" ? styles.sidebarButtonActive : styles.sidebarButton}
                            onClick={() => setActiveModule("press-releases")}
                        >
                            Press Releases
                        </button>
                        <button
                            type="button"
                            className={activeModule === "media-signups" ? styles.sidebarButtonActive : styles.sidebarButton}
                            onClick={() => setActiveModule("media-signups")}
                        >
                            Media Signups
                        </button>
                        <button
                            type="button"
                            className={activeModule === "enquiries" ? styles.sidebarButtonActive : styles.sidebarButton}
                            onClick={() => setActiveModule("enquiries")}
                        >
                            Enquiries
                        </button>
                        <button
                            type="button"
                            className={activeModule === "payments" ? styles.sidebarButtonActive : styles.sidebarButton}
                            onClick={() => setActiveModule("payments")}
                        >
                            Payments
                        </button>
                        <button
                            type="button"
                            className={activeModule === "users" ? styles.sidebarButtonActive : styles.sidebarButton}
                            onClick={() => setActiveModule("users")}
                        >
                            Portal members
                        </button>
                        <button
                            type="button"
                            className={activeModule === "email-digest" ? styles.sidebarButtonActive : styles.sidebarButton}
                            onClick={() => setActiveModule("email-digest")}
                        >
                            Email Digest
                        </button>
                        <button
                            type="button"
                            className={activeModule === "analytics" ? styles.sidebarButtonActive : styles.sidebarButton}
                            onClick={() => setActiveModule("analytics")}
                        >
                            Analytics
                        </button>
                        <button
                            type="button"
                            className={activeModule === "site-access" ? styles.sidebarButtonActive : styles.sidebarButton}
                            onClick={() => setActiveModule("site-access")}
                        >
                            Site access
                        </button>
                    </aside>

                    <div className={styles.moduleContent}>
                <section className={styles.paymentSettings} hidden={activeModule !== "payments"}>
                    <article className={styles.statCard}>
                        <span>Square mode</span>
                        <strong>{paymentGateway?.test_mode ? "Test" : "Production"}</strong>
                        <p>
                            {paymentGateway?.test_mode
                                ? "Sandbox credentials are active for checkout testing."
                                : "Production credentials are active for live payments."}
                        </p>
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={togglePaymentTestMode}
                            disabled={!paymentGateway || isUpdatingPaymentMode}
                        >
                            {isUpdatingPaymentMode
                                ? "Updating..."
                                : paymentGateway?.test_mode
                                    ? "Disable test mode"
                                    : "Enable test mode"}
                        </Button>
                    </article>
                </section>

                <section className={styles.releaseQueue} hidden={activeModule !== "enquiries"}>
                    <div className={styles.queueHeader}>
                        <div>
                            <span className={styles.kicker}>Contact form</span>
                            <h2>Site enquiries</h2>
                            <p>Includes general contact messages and proposal requests from the Pricing page. Use Portal members to invite contacts without an account and to assign credits after registration.</p>
                        </div>
                    </div>

                    <div className={styles.releaseList}>
                        {contactMessages.length === 0 ? (
                            <p className={styles.detailEmpty}>No contact messages yet.</p>
                        ) : (
                            contactMessages.map((row) => (
                                <article key={row.id} className={styles.enquiryCard}>
                                    <div className={styles.releaseSummary}>
                                        <div>
                                            <span className={styles.enquiryName}>{row.name}</span>
                                            <span className={styles.enquiryMeta}>
                                                {row.email}
                                                {row.organization ? ` · ${row.organization}` : ""}
                                            </span>
                                        </div>
                                        <span className={styles.statusBadge}>
                                            {row.entrySource === "pricing_proposal" ? "Pricing proposal" : "Contact"}
                                        </span>
                                    </div>
                                    <div className={`${styles.releaseBody} ${styles.submitterCardBody}`}>
                                        <p>
                                            <strong>Inquiry:</strong> {row.inquiryType}
                                            {" · "}
                                            <strong>Submitted:</strong> {formatDate(row.createdAt)}
                                        </p>
                                        <p style={{ whiteSpace: "pre-wrap" }}>{row.message}</p>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>

                <section className={styles.releaseQueue} hidden={activeModule !== "press-releases"}>
                    <div className={styles.queueHeader}>
                        <div>
                            <span className={styles.kicker}>Press releases</span>
                            <h2>Review newsroom submissions</h2>
                            <p>Approve paid submissions to publish them on the homepage and newsroom, or reject items that should not go live.</p>
                        </div>

                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={() => refreshPressReleases()}
                            disabled={isRefreshingPressReleases}
                        >
                            {isRefreshingPressReleases ? "Refreshing..." : "Refresh releases"}
                        </Button>
                    </div>

                    <nav className={styles.tabBar} aria-label="Press release editorial tabs">
                        {PRESS_RELEASE_QUEUE_TABS.map((tab) => {
                            const isActive = pressReleaseStatusTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
                                    onClick={() => {
                                        void refreshPressReleases(false, 1, tab.id);
                                    }}
                                    aria-pressed={isActive}
                                >
                                    <span>{tab.label}</span>
                                    <strong>{pressReleaseQueueCounts[tab.id]}</strong>
                                </button>
                            );
                        })}
                    </nav>

                    <div className={styles.queueStats}>
                        <span>In this tab: {pressReleaseTotalCount}</span>
                        <span>
                            Page {pressReleasePage} of {pressReleaseTotalPages}
                        </span>
                    </div>

                    {pressReleases.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h2>{pressReleaseEmptyCopy.title}</h2>
                            <p>{pressReleaseEmptyCopy.description}</p>
                        </div>
                    ) : (
                        <div className={styles.releaseList}>
                            {pressReleases.map((release) => {
                                const actionBusy = pressReleaseAction?.id === release.id;
                                const isPendingReview = release.status === "pending";

                                let combinedBadgeLabel = "Pending review";
                                let combinedBadgeClass = styles.statusPaidPendingReview;

                                if (release.status === "approved") {
                                    combinedBadgeLabel = "Approved";
                                    combinedBadgeClass = styles.statusApproved;
                                } else if (release.status === "rejected") {
                                    combinedBadgeLabel = "Rejected";
                                    combinedBadgeClass = styles.statusRejected;
                                }

                                const canApprove = isPendingReview;
                                const canReject = isPendingReview;

                                return (
                                    <article key={release.id} className={styles.enquiryCard}>
                                        <div className={styles.releaseSummary}>
                                            <div>
                                                <span className={styles.enquiryName}>
                                                    {release.featured || release.featuredUpgrade ? (
                                                        <span
                                                            className={styles.pressReleaseFeaturedBadge}
                                                            title="Featured — prioritize review"
                                                            aria-label="Featured"
                                                        >
                                                            ⭐
                                                        </span>
                                                    ) : null}
                                                    {stripTagsToPlainText(release.title)}
                                                </span>
                                                <span className={styles.enquiryMeta}>
                                                    {release.category || "News"} · {release.island || "Regional"}
                                                </span>
                                            </div>

                                            <div className={styles.releaseBadges}>
                                                <span className={`${styles.statusBadge} ${combinedBadgeClass}`}>{combinedBadgeLabel}</span>
                                            </div>
                                        </div>

                                        <div className={styles.releaseBody}>
                                            <p className={styles.releaseSummaryText}>{releaseCardExcerpt(release, 360)}</p>

                                            <div className={`${styles.actionGroup} ${styles.pressReleaseActions}`}>
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    size="md"
                                                    onClick={() => syncPressReleaseStatus(release.id, "approved")}
                                                    disabled={actionBusy || release.status === "approved" || !canApprove}
                                                >
                                                    {actionBusy && pressReleaseAction?.status === "approved" ? "Approving..." : "Approve"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="md"
                                                    onClick={() => {
                                                        setRejectModal({ id: release.id, title: release.title });
                                                        setRejectionReason("");
                                                    }}
                                                    disabled={actionBusy || release.status === "rejected" || !canReject}
                                                >
                                                    {actionBusy && pressReleaseAction?.status === "rejected" ? "Rejecting..." : "Reject"}
                                                </Button>
                                                {release.status === "approved" ? (
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="md"
                                                        onClick={() => toggleFeaturedPressRelease(release)}
                                                    >
                                                        {release.featured ? "Featured: On" : "Featured: Off"}
                                                    </Button>
                                                ) : null}
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="md"
                                                    onClick={() => setEditModal(mapReleaseToEditModal(release))}
                                                >
                                                    Edit
                                                </Button>
                                                {release.status === "approved" ? (
                                                    <Link href={`/newsroom/${release.slug}`} target="_blank">
                                                        Open release
                                                    </Link>
                                                ) : null}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {pressReleaseTotalPages > 1 ? (
                        <nav className={styles.adminPressReleasePagination} aria-label="Press release pages">
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => goToPressReleasePage(pressReleasePage - 1)}
                                disabled={pressReleasePage <= 1 || isRefreshingPressReleases}
                            >
                                Previous
                            </Button>
                            <span className={styles.adminPressReleasePaginationStatus}>
                                Page {pressReleasePage} of {pressReleaseTotalPages}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => goToPressReleasePage(pressReleasePage + 1)}
                                disabled={pressReleasePage >= pressReleaseTotalPages || isRefreshingPressReleases}
                            >
                                Next
                            </Button>
                        </nav>
                    ) : null}
                </section>

                <section className={styles.releaseQueue} hidden={activeModule !== "users"}>
                    <div className={styles.queueHeader}>
                        <div>
                            <span className={styles.kicker}>Portal members</span>
                            <h2>Registered members & proposal contacts</h2>
                            <p>
                                Everyone with a portal account is listed the same way. Add credits for any member.
                                For visitors who only used the contact form, send a portal invite first—then add credits once they appear under Registered Users.
                            </p>
                        </div>
                    </div>

                    <nav className={styles.tabBar} aria-label="Portal member categories">
                        <button
                            type="button"
                            className={`${styles.tabButton} ${pressSubmitterSubTab === "registered" ? styles.tabButtonActive : ""}`}
                            onClick={() => setPressSubmitterSubTab("registered")}
                            aria-pressed={pressSubmitterSubTab === "registered"}
                        >
                            Registered Users
                        </button>
                        <button
                            type="button"
                            className={`${styles.tabButton} ${pressSubmitterSubTab === "contact-only" ? styles.tabButtonActive : ""}`}
                            onClick={() => setPressSubmitterSubTab("contact-only")}
                            aria-pressed={pressSubmitterSubTab === "contact-only"}
                        >
                            Proposal / contact-only
                        </button>
                    </nav>

                    {pressSubmitterSubTab === "registered" ? (
                        <div className={styles.releaseList}>
                            <div className={styles.pressSubmitterSearchWrap}>
                                <FormControl>
                                    <FormLabel htmlFor="portal-member-email-search">Search by email</FormLabel>
                                    <Input
                                        id="portal-member-email-search"
                                        name="registeredUserSearch"
                                        type="search"
                                        placeholder="Filter registered users by email…"
                                        value={registeredUserSearch}
                                        onChange={(event) => setRegisteredUserSearch(event.target.value)}
                                        autoComplete="off"
                                    />
                                </FormControl>
                            </div>
                            {adminUsers.length === 0 ? (
                                <p className={styles.detailEmpty}>No portal members loaded yet.</p>
                            ) : registeredUsersFiltered.length === 0 ? (
                                <p className={styles.detailEmpty}>No users match that email filter.</p>
                            ) : (
                                registeredUsersFiltered.map((user) => (
                                    <article key={user.id} className={styles.enquiryCard}>
                                        <div className={`${styles.releaseSummary} ${styles.pressSubmitterUserSummary}`}>
                                            <div className={styles.pressSubmitterUserSummaryMain}>
                                                <span className={styles.enquiryName}>{user.firstName} {user.lastName}</span>
                                                <span className={styles.enquiryMeta}>
                                                    {user.email} · {user.organization || "No organization"}
                                                </span>
                                            </div>
                                            <div className={styles.pressSubmitterUserSummaryCredits}>
                                                <span className={styles.statusBadge}>{user.credits} credits</span>
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    size="md"
                                                    onClick={() => {
                                                        setAddCreditModalUser(user);
                                                        setAddCreditAmountInput("1");
                                                    }}
                                                >
                                                    Add credits
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={`${styles.releaseBody} ${styles.submitterCardBody}`}>
                                            <p>
                                                Package: {user.packageType || "-"} · Credits: {user.credits} total
                                                {user.creditsExpiresAt
                                                    ? ` · Next credit expiry: ${formatDate(user.creditsExpiresAt)}`
                                                    : ""}
                                                {typeof user.bundleCreditsRemaining === "number" && user.bundleCreditsRemaining > 0
                                                    ? ` · 3-Release pool: ${user.bundleCreditsRemaining} (earliest ${user.bundleCreditsExpiresAt ? formatDate(user.bundleCreditsExpiresAt) : user.creditsExpiresAt ? formatDate(user.creditsExpiresAt) : "—"})`
                                                    : ""}
                                                {" · "}Total submissions: {user.totalSubmissions ?? 0} · Digest: {user.digestSubscribed ? "Yes" : "No"} · Joined: {formatDate(user.createdAt)}
                                            </p>
                                            <div className={styles.actionGroup}>
                                                <Button type="button" variant="secondary" size="md" onClick={() => setActiveModule("press-releases")}>
                                                    View Submissions
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className={styles.releaseList}>
                            {contactOnlyProfiles.length === 0 ? (
                                <p className={styles.detailEmpty}>
                                    No proposal or contact-only visitors right now—every contact email already matches a portal account, or the inbox is empty.
                                </p>
                            ) : (
                                contactOnlyProfiles.map((row) => {
                                    const inviteBusyRow = contactInviteSubmittingId === row.id
                                        || portalInviteSubmittingId !== null
                                        || inviteJobId !== null;

                                    return (
                                        <article key={row.id} className={styles.enquiryCard}>
                                            <div className={styles.releaseSummary}>
                                                <div>
                                                    <span className={styles.enquiryName}>{row.name}</span>
                                                    <span className={styles.enquiryMeta}>
                                                        {row.email}
                                                        {row.organization ? ` · ${row.organization}` : ""}
                                                    </span>
                                                </div>
                                                <span className={styles.statusBadge}>
                                                    {row.entrySource === "pricing_proposal" ? "Pricing proposal" : "Contact"}
                                                </span>
                                            </div>
                                            <div className={`${styles.releaseBody} ${styles.submitterCardBody}`}>
                                                <p>
                                                    <strong>Inquiry:</strong> {row.inquiryType}
                                                    {" · "}
                                                    <strong>Submitted:</strong> {formatDate(row.createdAt)}
                                                    {row.portalInviteComplete ? " · Portal invite completed" : null}
                                                </p>
                                                <p style={{ whiteSpace: "pre-wrap" }}>{row.message}</p>
                                                <div className={styles.actionGroup}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="md"
                                                        onClick={() => {
                                                            void startContactPortalInvite(row.id);
                                                        }}
                                                        disabled={inviteBusyRow || row.portalInviteComplete}
                                                    >
                                                        {row.portalInviteComplete
                                                            ? "Portal invited"
                                                            : inviteBusyRow
                                                                ? "Sending invitation…"
                                                                : "Invite to Portal"}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        size="md"
                                                        onClick={() => {
                                                            const linked = findPortalMemberByEmail(row.email);

                                                            if (!linked) {
                                                                setToast({
                                                                    tone: "error",
                                                                    message: "No portal account uses this email yet. Send a portal invite first, then add credits from Registered Users or here once they appear.",
                                                                });
                                                                return;
                                                            }

                                                            setAddCreditModalUser(linked);
                                                            setAddCreditAmountInput("1");
                                                        }}
                                                    >
                                                        Add credits
                                                    </Button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                        </div>
                    )}
                </section>

                <section className={styles.releaseQueue} hidden={activeModule !== "email-digest"}>
                    <div className={styles.queueHeader}>
                        <div>
                            <span className={styles.kicker}>Email digest</span>
                            <h2>Digest settings</h2>
                            <p>Choose the email digest cadence for subscribed users and send the latest releases on demand.</p>
                            <p className={styles.digestScheduleNote}>
                                <strong>Automatic sends (Eastern Time):</strong> Daily — every day at 8:00 a.m. 3× weekly — Monday,
                                Wednesday, and Friday at 8:00 a.m. Saving frequency updates all opted-in users to that cadence
                                and controls which schedule runs. The server must be running at send time (Node cron).
                            </p>
                        </div>
                    </div>

                    <div className={styles.paymentSettings}>
                        <article className={styles.statCard}>
                            <span>Frequency</span>
                            <div className={styles.digestRadioGroup} role="radiogroup" aria-label="Digest frequency">
                                <label className={styles.digestRadioLabel}>
                                    <input
                                        type="radio"
                                        name="digest-frequency"
                                        checked={(digestSettings?.frequency ?? "daily") === "daily"}
                                        onChange={() => setDigestSettings((current) => ({
                                            ...(current ?? { lastDigestSent: null, optedInJournalists: [], frequency: "daily" }),
                                            frequency: "daily",
                                        }))}
                                    />
                                    Daily
                                </label>
                                <label className={styles.digestRadioLabel}>
                                    <input
                                        type="radio"
                                        name="digest-frequency"
                                        checked={digestSettings?.frequency === "3x-weekly"}
                                        onChange={() => setDigestSettings((current) => ({
                                            ...(current ?? { lastDigestSent: null, optedInJournalists: [], frequency: "daily" }),
                                            frequency: "3x-weekly",
                                        }))}
                                    />
                                    3x Weekly (Mon/Wed/Fri)
                                </label>
                            </div>
                            <p>Last digest sent: {digestSettings?.lastDigestSent ? formatDate(digestSettings.lastDigestSent) : "Never"}</p>
                            <div className={`${styles.actionGroup} ${styles.digestActions}`}>
                                <Button type="button" variant="secondary" size="md" onClick={saveDigestFrequency}>Save Frequency</Button>
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="md"
                                    onClick={() => {
                                        void sendDigestNow();
                                    }}
                                    disabled={digestSendBusy}
                                >
                                    {digestSendBusy ? "Sending…" : "Send Digest Now"}
                                </Button>
                            </div>
                        </article>
                    </div>
                </section>

                <section className={styles.releaseQueue} hidden={activeModule !== "analytics"}>
                    <div className={styles.queueHeader}>
                        <div>
                            <span className={styles.kicker}>Analytics</span>
                            <h2>Performance overview</h2>
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        <article className={styles.statCard}><span>Total submissions this month</span><strong>{analytics?.totalSubmissionsThisMonth ?? 0}</strong></article>
                        <article className={styles.statCard}><span>Total revenue this month</span><strong>${analytics?.totalRevenueThisMonth ?? 0}</strong></article>
                        <article className={styles.statCard}><span>Total approved this month</span><strong>{analytics?.totalApprovedThisMonth ?? 0}</strong></article>
                        <article className={styles.statCard}><span>Total portal members</span><strong>{analytics?.totalPortalMembersSignedUp ?? 0}</strong></article>
                    </div>

                    <div className={styles.releaseList}>
                        <article className={`${styles.enquiryCard} ${styles.analyticsPanel}`}>
                            <h3 className={styles.analyticsPanelTitle}>Top 5 most viewed releases</h3>
                            {(analytics?.topViewedReleases ?? []).map((release) => (
                                <p key={release.id}>{stripTagsToPlainText(release.title)} — {release.views} views</p>
                            ))}
                        </article>
                        <article className={`${styles.enquiryCard} ${styles.analyticsPanel}`}>
                            <h3 className={styles.analyticsPanelTitle}>Revenue by package</h3>
                            <p>Single Release: {analytics?.revenueByPackage?.single.sales ?? 0} sales = ${analytics?.revenueByPackage?.single.revenue ?? 0}</p>
                            <p>3-Release Pack: {analytics?.revenueByPackage?.bundle.sales ?? 0} sales = ${analytics?.revenueByPackage?.bundle.revenue ?? 0}</p>
                            <p>Featured Add-on: {analytics?.revenueByPackage?.featuredAddon.sales ?? 0} sales = ${analytics?.revenueByPackage?.featuredAddon.revenue ?? 0}</p>
                        </article>
                    </div>
                </section>

                <section className={styles.releaseQueue} hidden={activeModule !== "site-access"}>
                    <div className={styles.queueHeader}>
                        <div>
                            <span className={styles.kicker}>Security</span>
                            <h2>Public site IP restriction</h2>
                        </div>
                    </div>

                    <div className={styles.paymentSettings}>
                        <article className={styles.statCard}>
                            <label className={styles.siteAccessToggle}>
                                <input
                                    type="checkbox"
                                    checked={siteAccessSettings?.enabled ?? false}
                                    onChange={(event) => {
                                        setSiteAccessSettings((current) => ({
                                            enabled: event.target.checked,
                                            entries: current?.entries ?? [],
                                        }));
                                    }}
                                    disabled={!siteAccessSettings}
                                />
                                <span>Restrict public site to allowlisted IPv4 addresses only</span>
                            </label>
                            <p className={styles.siteAccessHelp}>
                                The toggle is saved in the database. The <strong>allowed IPv4 list is fixed in backend code</strong>{" "}
                                (<code>STATIC_SITE_IP_ALLOWLIST_ENTRIES</code> in <code>siteIpAllowlist.service.ts</code>) — add or remove
                                addresses there and redeploy the API. The table below is read-only. Use{" "}
                                <code>SITE_IP_ALLOWLIST_DISABLE=true</code> on the Next.js host only if you must bypass the gate during an outage.
                            </p>

                            <div className={styles.siteAccessTableWrap}>
                                <table className={styles.siteAccessTable}>
                                    <thead>
                                        <tr>
                                            <th scope="col">IPv4 address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(siteAccessSettings?.entries ?? []).map((row) => (
                                            <tr key={row.ip}>
                                                <td><code className={styles.siteAccessMono}>{row.ip}</code></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className={`${styles.actionGroup} ${styles.digestActions}`}>
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="md"
                                    disabled={!siteAccessSettings || siteAccessSaving}
                                    onClick={() => {
                                        void saveSiteAccess();
                                    }}
                                >
                                    {siteAccessSaving ? "Saving…" : "Save settings"}
                                </Button>
                            </div>
                        </article>
                    </div>
                </section>

                <div hidden={activeModule !== "media-signups"} className={styles.mediaSignupFlow}>
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
                                onClick={() => {
                                    setActiveTab(tab.status);
                                    setExpandedId(enquiries.find((enquiry) => enquiry.status === tab.status)?.id ?? null);
                                }}
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
                                        {selectedEnquiry.portalInvitedAt ? (
                                            <li>
                                                <strong>Portal invited:</strong> {formatDate(selectedEnquiry.portalInvitedAt)}
                                            </li>
                                        ) : null}
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
                    <Link href="/join-the-media-network">Open the public application page</Link>
                </div>
                </div>

                    </div>
                </div>
            </Container>
        </section>
    );
}
