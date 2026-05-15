"use client";

import { SvgIcon } from "../ui";
import styles from "./PaymentSuccessfulSection.module.scss";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PaymentSummary = {
  orderNumber?: string;
  amountCents?: number;
  customerEmail?: string | null;
  packageId?: string;
};

type ReleaseSummary = {
  packageId?: string;
  featuredUpgrade?: boolean;
};

function formatPackageName(release: ReleaseSummary | null, payment: PaymentSummary | null) {
  const pkg = release?.packageId ?? payment?.packageId ?? "single";
  const featured = Boolean(release?.featuredUpgrade);
  const base =
    pkg === "bundle" ? "3-Release Package" : pkg === "custom" ? "Professional Campaigns" : "Single Release";
  return featured ? `${base} + Featured Placement` : base;
}

function MetaValueSkeleton({ wide }: { wide?: boolean }) {
  return (
    <span
      className={wide ? `${styles.metaValueSkeleton} ${styles.metaValueSkeletonWide}` : styles.metaValueSkeleton}
      aria-hidden
    />
  );
}

export default function PaymentSuccessfulSection() {
  const searchParams = useSearchParams();
  const releaseId = searchParams.get("releaseId");
  const orderId = searchParams.get("orderId");
  const hasLookup = Boolean(releaseId || orderId);

  const [payment, setPayment] = useState<PaymentSummary | null>(null);
  const [release, setRelease] = useState<ReleaseSummary | null>(null);
  const [orderMetaPending, setOrderMetaPending] = useState(hasLookup);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!releaseId && !orderId) {
      setOrderMetaPending(false);
      setLoadError(false);
      return;
    }

    const controller = new AbortController();
    setOrderMetaPending(true);
    setLoadError(false);

    const url = orderId
      ? `/api/payments/square/order/${encodeURIComponent(orderId)}`
      : `/api/payments/square/release/${encodeURIComponent(releaseId || "")}`;

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
          setOrderMetaPending(false);
        }
      });

    return () => controller.abort();
  }, [orderId, releaseId]);

  const pending = orderMetaPending;
  const amountPaid =
    typeof payment?.amountCents === "number" ? `$${(payment.amountCents / 100).toFixed(2)}` : null;
  const packageName = formatPackageName(release, payment);
  const orderNumberDisplay = payment?.orderNumber ? `#${payment.orderNumber}` : null;

  return (
    <section className={styles.paymentSuccessfulPage}>
      <div className={styles.confettiLayer} aria-hidden="true"></div>

      <div className={styles.successCard}>
        <SvgIcon icon="payment-successfull" />

        <h1>Payment Successful!</h1>

        <p>Thank you for your purchase. Your order has been confirmed.</p>

        {!hasLookup ? (
          <p className={styles.missingParamsNote}>
            If you just paid, use the return link from checkout or the confirmation email to see your order
            details here.
          </p>
        ) : null}

        <div className={styles.orderMetaCard} aria-busy={pending}>
          <div className={styles.orderMetaHeader}>
            <span>Order Total</span>
            {pending ? (
              <MetaValueSkeleton wide />
            ) : loadError ? (
              <strong className={styles.metaUnavailable}>—</strong>
            ) : (
              <strong>{amountPaid ?? "Confirmed"}</strong>
            )}
          </div>

          <div className={styles.orderMetaFooter}>
            <span>Order Number</span>
            {pending ? (
              <MetaValueSkeleton />
            ) : loadError ? (
              <span className={styles.metaUnavailable}>Unavailable</span>
            ) : (
              <span className={styles.orderNumberValue}>{orderNumberDisplay ?? "—"}</span>
            )}
          </div>

          <div className={styles.orderMetaFooter}>
            <span>Package</span>
            {pending ? (
              <MetaValueSkeleton />
            ) : loadError ? (
              <span className={styles.metaUnavailable}>—</span>
            ) : (
              <span>{packageName}</span>
            )}
          </div>

          {loadError ? (
            <p className={styles.orderMetaError} role="alert">
              We could not load this receipt in the browser. Your payment may still be confirmed—check your
              email or visit My Portal.
            </p>
          ) : null}
        </div>

        <p className={styles.followUpText}>
          You will receive a confirmation email with your release credits and submission instructions within the
          next few minutes.
        </p>

        <div className={styles.actionRow}>
          <Link href="/submit-your-press-release" className={`${styles.actionButton} ${styles.primaryAction}`}>
            Submit Your Release
          </Link>

          <Link href="/portal" className={`${styles.actionButton} ${styles.secondaryAction}`}>
            My Portal
          </Link>

          <Link href="/" className={`${styles.actionButton} ${styles.secondaryAction}`}>
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
