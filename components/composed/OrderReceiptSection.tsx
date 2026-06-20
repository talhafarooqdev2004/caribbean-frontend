"use client";

import styles from "./OrderReceiptSection.module.scss";

import Link from "next/link";
import { Loader2, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout";

type PaymentSummary = {
    orderNumber?: string;
    amountCents?: number;
    customerEmail?: string | null;
    packageId?: string;
    status?: string;
    currency?: string;
    createdAt?: string;
    featuredUpgrade?: boolean;
};

type ReleaseSummary = {
    packageId?: string;
    featuredUpgrade?: boolean;
};

function formatPackageTitle(release: ReleaseSummary | null, payment: PaymentSummary | null) {
    const packageId = release?.packageId ?? payment?.packageId ?? "single";
    const featured = Boolean(release?.featuredUpgrade ?? payment?.featuredUpgrade);
    const base =
        packageId === "bundle"
            ? "3-Release Package"
            : packageId === "custom"
              ? "Professional Campaign"
              : "Single Release";

    return featured ? `${base} + Featured Placement` : base;
}

function formatPackageSubtitle(packageId: string | undefined) {
    if (packageId === "custom") {
        return "Multi-island campaign distribution";
    }

    return "Caribbean-wide distribution";
}

function formatCurrency(cents: number | null | undefined) {
    if (typeof cents !== "number" || Number.isNaN(cents)) {
        return "—";
    }

    return `$${(cents / 100).toFixed(2)}`;
}

function formatReceiptDate(isoDate: string | undefined) {
    if (!isoDate) {
        return "—";
    }

    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function formatOrderRef(orderNumber: string | null | undefined) {
    if (!orderNumber) {
        return "—";
    }

    return `#CNW-${orderNumber}`;
}

export default function OrderReceiptSection() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId")?.trim() ?? "";
    const releaseId = searchParams.get("releaseId")?.trim() ?? "";
    const hasLookup = Boolean(orderId || releaseId);

    const [payment, setPayment] = useState<PaymentSummary | null>(null);
    const [release, setRelease] = useState<ReleaseSummary | null>(null);
    const [pending, setPending] = useState(hasLookup);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!hasLookup) {
            setPending(false);
            setLoadError(false);
            return;
        }

        const controller = new AbortController();
        setPending(true);
        setLoadError(false);

        const url = orderId
            ? `/api/payments/square/order/${encodeURIComponent(orderId)}`
            : `/api/payments/square/release/${encodeURIComponent(releaseId)}`;

        void fetch(url, { cache: "no-store", signal: controller.signal })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("lookup failed");
                }

                return response.json() as Promise<{ payment?: PaymentSummary | null; release?: ReleaseSummary | null }>;
            })
            .then((payload) => {
                setPayment(payload?.payment ?? null);
                setRelease(payload?.release ?? null);
                setLoadError(false);
            })
            .catch(() => {
                if (controller.signal.aborted) {
                    return;
                }

                setPayment(null);
                setRelease(null);
                setLoadError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setPending(false);
                }
            });

        return () => controller.abort();
    }, [hasLookup, orderId, releaseId]);

    const packageId = release?.packageId ?? payment?.packageId;
    const packageTitle = formatPackageTitle(release, payment);
    const packageSubtitle = formatPackageSubtitle(packageId);
    const orderRef = formatOrderRef(payment?.orderNumber ?? (orderId || null));
    const amountCents = payment?.amountCents ?? null;
    const receiptDate = formatReceiptDate(payment?.createdAt);
    const customerEmail = payment?.customerEmail?.trim() || "—";
    const paymentStatus = payment?.status === "paid" ? "Paid" : payment?.status ? payment.status : "Confirmed";

    return (
        <section className={styles.receiptPage}>
            <Container className={styles.receiptContainer}>
                <article className={styles.receiptCard} aria-busy={pending}>
                    <header className={styles.receiptHeader}>
                        <div className={styles.brandBlock}>
                            <span className={styles.eyebrow}>Carib Newswire</span>
                            <h1>Receipt</h1>
                            <p>Thank you for your purchase.</p>
                        </div>

                        <div className={styles.headerMeta}>
                            <div>
                                <span>Order ref</span>
                                <strong>{pending ? "Loading…" : orderRef}</strong>
                            </div>
                            <div>
                                <span>Date</span>
                                <strong>{pending ? "Loading…" : receiptDate}</strong>
                            </div>
                        </div>
                    </header>

                    <div className={styles.receiptBody}>
                        {!hasLookup ? (
                            <p className={styles.notice}>
                                Open this page from your checkout confirmation or the link in your confirmation email
                                to view your receipt.
                            </p>
                        ) : null}

                        {loadError ? (
                            <p className={styles.errorNotice} role="alert">
                                We could not load this receipt. Your payment may still be confirmed — check your email
                                or visit My Portal.
                            </p>
                        ) : null}

                        <div className={styles.infoGrid}>
                            <div>
                                <span className={styles.infoLabel}>Billed to</span>
                                <strong>{pending ? "Loading…" : customerEmail}</strong>
                            </div>
                            <div>
                                <span className={styles.infoLabel}>Payment status</span>
                                <strong className={styles.paidStatus}>{pending ? "Loading…" : paymentStatus}</strong>
                            </div>
                        </div>

                        <div className={styles.lineItems}>
                            <div className={styles.lineItemsHeader}>
                                <span>Description</span>
                                <span>Amount</span>
                            </div>

                            {pending ? (
                                <div className={styles.lineItem}>
                                    <div className={styles.lineItemInfo}>
                                        <strong>Loading order…</strong>
                                    </div>
                                    <span>—</span>
                                </div>
                            ) : (
                                <div className={styles.lineItem}>
                                    <div className={styles.lineItemInfo}>
                                        <strong>{packageTitle}</strong>
                                        <span>{packageSubtitle}</span>
                                    </div>
                                    <strong>{formatCurrency(amountCents)}</strong>
                                </div>
                            )}
                        </div>

                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Subtotal</span>
                                <span>{pending ? "—" : formatCurrency(amountCents)}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                <strong>Total paid</strong>
                                <strong>{pending ? "—" : formatCurrency(amountCents)}</strong>
                            </div>
                        </div>

                        <p className={styles.footerNote}>
                            A copy of this receipt has been sent to your email. For questions about your order,
                            contact support through the Contact Us page.
                        </p>
                    </div>

                    <footer className={styles.receiptActions}>
                        <button type="button" className={styles.printButton} onClick={() => window.print()}>
                            <Printer size={16} strokeWidth={2} aria-hidden />
                            Print Receipt
                        </button>

                        <Link href="/submit-your-press-release" className={styles.primaryLink}>
                            Submit a Release
                        </Link>

                        <Link href="/portal" className={styles.secondaryLink}>
                            My Portal
                        </Link>
                    </footer>
                </article>

                {pending ? (
                    <div className={styles.loadingOverlay} aria-hidden>
                        <Loader2 size={22} strokeWidth={2} />
                    </div>
                ) : null}
            </Container>
        </section>
    );
}
