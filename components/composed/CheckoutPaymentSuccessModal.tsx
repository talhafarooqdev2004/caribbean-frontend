"use client";

import styles from "./CheckoutPaymentSuccessModal.module.scss";

import Link from "next/link";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

type PaymentSummary = {
    orderNumber?: string;
};

type CheckoutPaymentSuccessModalProps = {
    orderId: string;
};

export default function CheckoutPaymentSuccessModal({ orderId }: CheckoutPaymentSuccessModalProps) {
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        void fetch(`/api/payments/square/order/${encodeURIComponent(orderId)}`, {
            cache: "no-store",
            signal: controller.signal,
        })
            .then(async (response) => {
                if (!response.ok) {
                    return null;
                }

                return response.json() as Promise<{ payment?: PaymentSummary | null }>;
            })
            .then((payload) => {
                const number = payload?.payment?.orderNumber;
                setOrderNumber(typeof number === "string" && number.trim() ? number.trim() : null);
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setOrderNumber(null);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [orderId]);

    const orderRefDisplay = orderNumber ? `#CNW-${orderNumber}` : `#${orderId.slice(0, 8).toUpperCase()}`;
    const receiptHref = `/receipt?orderId=${encodeURIComponent(orderId)}`;

    return (
        <div className={styles.overlay} role="presentation">
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="checkout-success-title"
                aria-describedby="checkout-success-description"
            >
                <span className={styles.iconWrap} aria-hidden>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0003 29.3312C23.3635 29.3312 29.3326 23.3621 29.3326 15.9988C29.3326 8.63559 23.3635 2.6665 16.0003 2.6665C8.63706 2.6665 2.66797 8.63559 2.66797 15.9988C2.66797 23.3621 8.63706 29.3312 16.0003 29.3312Z" stroke="#C4922A" strokeWidth="2.66647" />
                        <path d="M10.6641 15.9987L14.6638 19.9984L21.3299 11.999" stroke="#C4922A" strokeWidth="3.33308" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="133.32 133.32" />
                    </svg>
                </span>

                <h2 id="checkout-success-title" className={styles.title}>
                    Payment <span>Successful!</span>
                </h2>

                <p id="checkout-success-description" className={styles.description}>
                    Your order has been successfully processed. A confirmation email has been sent with your
                    receipt and account information. You can now begin submitting your press releases.
                </p>

                <div className={styles.orderRef} aria-busy={loading}>
                    <span>Order ref:</span>
                    <strong>{loading ? "Loading…" : orderRefDisplay}</strong>
                </div>

                <div className={styles.actions}>
                    <Link href="/submit-your-press-release" className={styles.primaryAction}>
                        Submit a Release
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.12109 7.49531H11.8656M7.49335 11.8676L11.8656 7.49531L7.49335 3.12305" stroke="white" strokeWidth="1.56152" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <a
                        href={receiptHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryAction}
                    >
                        View Receipt
                    </a>
                </div>
            </div>
        </div>
    );
}
