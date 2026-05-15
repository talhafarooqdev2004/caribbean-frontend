"use client";

import styles from "./CheckoutDetails.module.scss";

import { Loader2, Lock, Minus, Plus, X } from "lucide-react";
import { Suspense, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Container } from "../layout";
import { Button, FormControl, FormLabel, Input } from "../ui";
import {
    CheckoutSquareCardAttacher,
    CheckoutSquareCardSuspenseFallback,
    resetSquareWebClientConfigCache,
    type SquareCard,
} from "./CheckoutSquareCardAttacher";

function CheckoutSquareCardAttacherGate({
    mountSelector,
    onCardReady,
    onSetupFailed,
    onHostCleared,
}: {
    mountSelector: string;
    onCardReady: (card: SquareCard) => void;
    onSetupFailed: (reason?: string) => void;
    onHostCleared?: () => void;
}) {
    const [run, setRun] = useState(false);

    useEffect(() => {
        setRun(true);
    }, []);

    if (!run) {
        return null;
    }

    return (
        <CheckoutSquareCardAttacher
            mountSelector={mountSelector}
            onCardReady={onCardReady}
            onSetupFailed={onSetupFailed}
            onHostCleared={onHostCleared}
        />
    );
}

type OrderDetails = {
    packageId: string;
    amountCents: number;
    featuredUpgrade: boolean;
};

type CheckoutFormValues = {
    email: string;
    cardholderName: string;
};

const unitPrice = 149;
const initialFormValues: CheckoutFormValues = {
    email: "",
    cardholderName: "",
};

function formatCurrency(value: number | null) {
    if (value === null || Number.isNaN(value)) {
        return "—";
    }

    return `$${value}`;
}

const DEFAULT_PAYMENT_ERROR = "We could not complete your payment. Please try again.";
const MAX_SQUARE_SETUP_RETRIES = 3;

type SquareTokenizeErrorLike = {
    message?: string;
    detail?: string;
    type?: string;
    field?: string;
};

function messageFromSquareTokenizeErrors(errors: SquareTokenizeErrorLike[] | undefined): string {
    if (!errors?.length) {
        return "Card details could not be verified.";
    }

    const first = errors[0];
    const text = (typeof first.message === "string" ? first.message : typeof first.detail === "string" ? first.detail : "")
        .trim();
    const field = typeof first.field === "string" ? first.field.toLowerCase() : "";
    const haystack = `${text} ${field}`.toLowerCase();

    if (field.includes("cvv") || haystack.includes("cvv") || haystack.includes("security code")) {
        return text.length > 0 ? text : "The security code (CVV) is incorrect.";
    }
    if (field.includes("expiration") || haystack.includes("expir")) {
        return text.length > 0 ? text : "The expiry date is incorrect or the card has expired.";
    }
    if (field.includes("postal") || haystack.includes("postal") || haystack.includes("zip")) {
        return text.length > 0 ? text : "The postal code could not be verified.";
    }
    if (field.includes("card") && (field.includes("number") || field.includes("pan")) || haystack.includes("card number")) {
        return text.length > 0 ? text : "The card number does not look valid.";
    }
    if (haystack.includes("insufficient")) {
        return "This card has insufficient funds.";
    }
    if (haystack.includes("declin")) {
        return "Your card was declined. Try another card or contact your bank.";
    }

    return text.length > 0 ? text : "Card details could not be verified.";
}

function paymentErrorMessage(payload: unknown): string {
    if (!payload || typeof payload !== "object") return DEFAULT_PAYMENT_ERROR;
    const p = payload as Record<string, unknown>;
    const err = typeof p.error === "string" ? p.error.trim() : "";
    const msg = typeof p.message === "string" ? p.message.trim() : "";
    const candidate = err || msg;
    if (!candidate) return DEFAULT_PAYMENT_ERROR;
    return candidate.replace(/^Payment failed:\s*/i, "").trim() || DEFAULT_PAYMENT_ERROR;
}

function validateCheckoutForm(values: CheckoutFormValues) {
    const normalizedValues: CheckoutFormValues = {
        email: values.email.trim().toLowerCase(),
        cardholderName: values.cardholderName.trim().replace(/\s+/g, " "),
    };

    const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

    if (!normalizedValues.email) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValues.email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!normalizedValues.cardholderName) {
        errors.cardholderName = "Cardholder name is required.";
    }

    return {
        values: Object.keys(errors).length > 0 ? null : normalizedValues,
        errors,
    };
}

type CheckoutDetailsProps = {
    creditPackage?: "single" | "bundle" | null;
};

export default function CheckoutDetails({ creditPackage = null }: CheckoutDetailsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const squareHostDomId = useId().replace(/[^a-zA-Z0-9_-]/g, "") || "host";
    const squareMountSelector = `#square-card-host-${squareHostDomId}`;
    const squareCardLabelId = `checkout-square-card-label-${squareHostDomId}`;

    const releaseId = searchParams.get("releaseId");
    const checkoutSessionId = searchParams.get("checkoutSessionId");
    const [quantity, setQuantity] = useState(1);
    const [releaseOrderDetails, setReleaseOrderDetails] = useState<OrderDetails | null>(null);
    const [releaseOrderError, setReleaseOrderError] = useState(false);
    const [creditFeaturedFromSession, setCreditFeaturedFromSession] = useState(false);
    const [formValues, setFormValues] = useState<CheckoutFormValues>(initialFormValues);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CheckoutFormValues, string>>>({});
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [squareCard, setSquareCard] = useState<SquareCard | null>(null);
    const [squareInitAttempt, setSquareInitAttempt] = useState(0);
    const [squareLoadMessage, setSquareLoadMessage] = useState<string | null>(null);
    const [squareRetryStopped, setSquareRetryStopped] = useState(false);
    const squareLoadFailuresRef = useRef(0);
    const squareCardHostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        squareLoadFailuresRef.current = 0;
    }, []);

    const handleSquareCardReady = useCallback((card: SquareCard) => {
        squareLoadFailuresRef.current = 0;
        setSquareLoadMessage(null);
        setSquareRetryStopped(false);
        setSquareCard(card);
    }, []);

    const handleSquareHostCleared = useCallback(() => {
        setSquareCard(null);
    }, []);

    const handleSquareSetupFailed = useCallback((reason?: string) => {
        setSquareCard(null);
        setSubmissionMessage(null);

        const failures = squareLoadFailuresRef.current;
        squareLoadFailuresRef.current = failures + 1;

        if (reason === "Square payment credentials are not configured.") {
            setSquareLoadMessage("Square payment credentials are not configured. Check your Square App ID and Location ID, then restart the backend.");
            setSquareRetryStopped(true);
            return;
        }

        if (failures >= MAX_SQUARE_SETUP_RETRIES) {
            setSquareRetryStopped(true);
            setSquareLoadMessage(
                reason
                    ? `Square card could not load: ${reason}`
                    : "Square card could not load. Please try again.",
            );
            return;
        }

        setSquareLoadMessage(
            reason
                ? `Still loading the secure card field. Retrying automatically. Last error: ${reason}`
                : "Still loading the secure card field. Retrying automatically.",
        );

        const delayMs = Math.min(600 + failures * 450, 5000);
        window.setTimeout(() => {
            setSquareInitAttempt((n) => n + 1);
        }, delayMs);
    }, []);

    const retrySquareCardLoad = useCallback(() => {
        resetSquareWebClientConfigCache();
        squareLoadFailuresRef.current = 0;
        setSquareCard(null);
        setSquareLoadMessage(null);
        setSquareRetryStopped(false);
        setSquareInitAttempt((n) => n + 1);
    }, []);

    useLayoutEffect(() => {
        if (releaseId || !creditPackage) {
            setCreditFeaturedFromSession(false);
            return;
        }

        if (!checkoutSessionId) {
            setCreditFeaturedFromSession(false);
            return;
        }

        try {
            const storedCheckoutSessionId = window.sessionStorage.getItem("carib_checkout_session_id");

            if (storedCheckoutSessionId !== checkoutSessionId) {
                setCreditFeaturedFromSession(false);
                return;
            }

            const raw = window.sessionStorage.getItem("carib_selected_package");
            if (!raw) {
                setCreditFeaturedFromSession(false);
                return;
            }

            const parsed = JSON.parse(raw) as { type?: string; featuredAddon?: boolean };

            if (parsed.type !== creditPackage) {
                setCreditFeaturedFromSession(false);
                return;
            }

            setCreditFeaturedFromSession(Boolean(parsed.featuredAddon));
        } catch {
            setCreditFeaturedFromSession(false);
        }
    }, [releaseId, creditPackage, checkoutSessionId]);

    const creditOrderDetails = useMemo((): OrderDetails | null => {
        if (releaseId) {
            return null;
        }

        if (creditPackage !== "single" && creditPackage !== "bundle") {
            return null;
        }

        const unitCents = creditPackage === "bundle" ? 39900 : 14900;

        if (quantity <= 0) {
            return {
                packageId: creditPackage,
                amountCents: 0,
                featuredUpgrade: creditFeaturedFromSession,
            };
        }

        return {
            packageId: creditPackage,
            amountCents: unitCents * quantity + (creditFeaturedFromSession ? 9900 : 0),
            featuredUpgrade: creditFeaturedFromSession,
        };
    }, [releaseId, creditPackage, quantity, creditFeaturedFromSession]);

    const orderDetails = releaseId ? releaseOrderDetails : creditOrderDetails;
    const isCreditCheckout = Boolean(creditPackage && !releaseId && orderDetails);
    const creditsPerPackageUnit =
        orderDetails?.packageId === "bundle" ? 3 : orderDetails?.packageId === "single" ? 1 : 0;

    const isReleaseOrderLoading = Boolean(releaseId && !releaseOrderDetails && !releaseOrderError);

    const squarePrereleaseReady = useMemo(
        () => !releaseId || releaseOrderDetails !== null || releaseOrderError,
        [releaseId, releaseOrderDetails, releaseOrderError],
    );

    const emptyCartMessage = useMemo(() => {
        if (releaseId) {
            return null;
        }

        if (creditPackage === "single" || creditPackage === "bundle") {
            return null;
        }

        return "Purchase a package on Pricing, or use a checkout link from your dashboard.";
    }, [releaseId, creditPackage]);

    const unitAmountDollars = useMemo((): number | null => {
        if (!orderDetails) {
            return null;
        }

        return Math.round(orderDetails.amountCents / 100);
    }, [orderDetails]);

    /** Credit checkout: total cents include package × quantity + optional featured ($99 once). Release: fixed release amount. */
    const subtotal = useMemo((): number | null => {
        if (releaseId && !orderDetails) {
            return null;
        }

        if (orderDetails && releaseId) {
            return unitAmountDollars;
        }

        if (orderDetails && isCreditCheckout) {
            return Math.round(orderDetails.amountCents / 100);
        }

        return quantity * unitPrice;
    }, [orderDetails, releaseId, isCreditCheckout, unitAmountDollars, quantity]);

    useEffect(() => {
        if (!releaseId) {
            setReleaseOrderError(false);
            setReleaseOrderDetails(null);
            return;
        }

        let cancelled = false;
        setReleaseOrderDetails(null);
        setReleaseOrderError(false);

        fetch(`/api/press-releases/${encodeURIComponent(releaseId)}`, { cache: "no-store", credentials: "include" })
            .then(async (response) => {
                if (cancelled) {
                    return null;
                }

                if (!response.ok) {
                    setReleaseOrderError(true);
                    setSubmissionMessage("We could not load your order details.");
                    return null;
                }

                return response.json() as Promise<Record<string, unknown>>;
            })
            .then((payload) => {
                if (cancelled || !payload) {
                    return;
                }

                const release = payload.release as Record<string, unknown> | undefined;

                if (!release || typeof release.packageId !== "string" || typeof release.amountCents !== "number") {
                    setReleaseOrderError(true);
                    setSubmissionMessage("We could not load your order details.");
                    return;
                }

                setReleaseOrderDetails({
                    packageId: release.packageId,
                    amountCents: release.amountCents,
                    featuredUpgrade: Boolean(release.featuredUpgrade),
                });
                setFormValues((current) => ({
                    ...current,
                    email: typeof release.email === "string" ? release.email : current.email,
                }));
                setQuantity(1);
            })
            .catch(() => {
                if (!cancelled) {
                    setReleaseOrderError(true);
                    setSubmissionMessage("We could not load your order details.");
                }
            });

        return () => {
            cancelled = true;
        };
    }, [releaseId]);

    useLayoutEffect(() => {
        if (!squarePrereleaseReady) {
            setSquareCard(null);
            setSquareLoadMessage(null);
            setSquareRetryStopped(false);
            squareLoadFailuresRef.current = 0;
        }
    }, [squarePrereleaseReady]);

    useEffect(() => {
        const origins = ["https://sandbox.web.squarecdn.com", "https://web.squarecdn.com"] as const;
        const appended: HTMLLinkElement[] = [];

        for (const href of origins) {
            if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
                continue;
            }

            const link = document.createElement("link");
            link.rel = "preconnect";
            link.href = href;
            link.crossOrigin = "";
            document.head.appendChild(link);
            appended.push(link);
        }

        return () => {
            for (const link of appended) {
                link.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (!squareCard || isReleaseOrderLoading) {
            return undefined;
        }

        let raf = 0;
        let effectActive = true;

        const recalc = () => {
            window.cancelAnimationFrame(raf);
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                squareCard.recalculateSize?.();
            });
        };

        /** Sync layout before the browser routes the tap into the wrong iframe (common on mobile / DPR changes). */
        const onPointerDownCapture = () => {
            squareCard.recalculateSize?.();
            recalc();
        };

        const onResize = () => recalc();

        const onVisibility = () => {
            if (document.visibilityState === "visible") {
                recalc();
            }
        };

        const t1 = window.setTimeout(recalc, 0);
        const t2 = window.setTimeout(recalc, 100);
        const t3 = window.setTimeout(recalc, 500);
        const t4 = window.setTimeout(recalc, 850);
        const t5 = window.setTimeout(recalc, 1200);

        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
        window.visualViewport?.addEventListener("resize", onResize);
        window.visualViewport?.addEventListener("scroll", onResize);
        document.addEventListener("visibilitychange", onVisibility);

        const host = squareCardHostRef.current;
        if (host) {
            host.addEventListener("pointerdown", onPointerDownCapture, true);
        }

        if (typeof document !== "undefined" && document.fonts?.ready) {
            void document.fonts.ready.then(() => {
                if (effectActive) {
                    recalc();
                }
            });
        }

        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined" && host) {
            ro = new ResizeObserver(() => {
                recalc();
            });
            ro.observe(host);
        }

        return () => {
            effectActive = false;
            window.cancelAnimationFrame(raf);
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.clearTimeout(t3);
            window.clearTimeout(t4);
            window.clearTimeout(t5);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("orientationchange", onResize);
            window.visualViewport?.removeEventListener("resize", onResize);
            window.visualViewport?.removeEventListener("scroll", onResize);
            document.removeEventListener("visibilitychange", onVisibility);
            if (host) {
                host.removeEventListener("pointerdown", onPointerDownCapture, true);
            }
            ro?.disconnect();
        };
    }, [squareCard, isReleaseOrderLoading, toast]);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(() => setToast(null), 8000);
        return () => window.clearTimeout(timer);
    }, [toast]);

    function updateField<K extends keyof CheckoutFormValues>(field: K, value: string) {
        setFormValues((current) => ({ ...current, [field]: value }));
        setFieldErrors((current) => {
            if (!current[field]) return current;
            const next = { ...current };
            delete next[field];
            return next;
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (quantity === 0) {
            setSubmissionMessage("Add an item to your order before proceeding.");
            return;
        }

        if (!releaseId && !creditPackage) {
            setSubmissionMessage("Purchase a package on Pricing, or use a checkout link from your dashboard.");
            return;
        }

        if (!orderDetails) {
            setSubmissionMessage("We could not load your order details.");
            return;
        }

        if (subtotal === null) {
            setSubmissionMessage("Your order is still loading. Please wait a moment.");
            return;
        }

        const validation = validateCheckoutForm(formValues);
        if (!validation.values) {
            setFieldErrors(validation.errors);
            setSubmissionMessage(null);
            return;
        }

        if (!squareCard) {
            setSubmissionMessage("Payment form is still loading.");
            return;
        }

        setFieldErrors({});
        setSubmissionMessage(null);
        setToast(null);
        setIsSubmitting(true);

        try {
            const tokenResult = await squareCard.tokenize();

            if (tokenResult.status !== "OK" || !tokenResult.token) {
                const reason = messageFromSquareTokenizeErrors(
                    tokenResult.errors as SquareTokenizeErrorLike[] | undefined,
                );
                setToast({ message: reason });
                return;
            }

            const isCreditPurchase = Boolean(creditPackage && !releaseId);
            const response = await fetch("/api/payments/square/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(
                    isCreditPurchase
                        ? {
                            sourceId: tokenResult.token,
                            creditPackage,
                            quantity: quantity,
                            featuredAddon: orderDetails.featuredUpgrade,
                            amount: subtotal,
                            email: validation.values.email,
                            cardholderName: validation.values.cardholderName,
                            ...(checkoutSessionId ? { creditCheckoutSessionId: checkoutSessionId } : {}),
                        }
                        : {
                            sourceId: tokenResult.token,
                            releaseId,
                            packageType: orderDetails.packageId,
                            featuredAddon: orderDetails.featuredUpgrade,
                            amount: subtotal,
                            email: validation.values.email,
                            cardholderName: validation.values.cardholderName,
                        },
                ),
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setToast({ message: paymentErrorMessage(payload) });
                return;
            }

            const orderId = payload?.orderId ?? payload?.data?.orderId;
            if (!orderId) {
                setToast({ message: "Payment went through but we could not confirm your order. Please contact support with your email." });
                return;
            }

            router.push(`/payment-successful?orderId=${encodeURIComponent(String(orderId))}`);
        } catch {
            setToast({ message: DEFAULT_PAYMENT_ERROR });
        } finally {
            setIsSubmitting(false);
        }
    }

    const lineItemQuantity = quantity;

    return (
        <section className={styles.checkoutSection}>
            <Container className={styles.checkoutInner}>
                <h1>Checkout</h1>

                {toast ? (
                    <div
                        className={`${styles.toast} ${styles.toastError}`}
                        role="alert"
                        aria-live="assertive"
                    >
                        {toast.message}
                    </div>
                ) : null}

                <div className={styles.checkoutGrid}>
                    <div className={styles.checkoutMainColumn}>
                        <section className={styles.card}>
                            <h2>Your Order</h2>

                            {isReleaseOrderLoading ? (
                                <div className={styles.orderLoading} role="status" aria-live="polite">
                                    <Loader2 className={styles.orderLoadingSpinner} size={20} strokeWidth={2} aria-hidden />
                                    <span>Loading your order…</span>
                                </div>
                            ) : releaseId && releaseOrderError ? (
                                <p className={styles.orderLoadError}>
                                    We could not load this order. Return to the submit page and try again, or contact support.
                                </p>
                            ) : lineItemQuantity > 0 ? (
                                <div className={styles.orderItemRow}>
                                    <div className={styles.orderItemDetails}>
                                        <strong>
                                            {orderDetails?.packageId === "bundle"
                                                ? "3-Release Package"
                                                : orderDetails?.packageId === "custom"
                                                    ? "Professional Campaign"
                                                    : "Single Release"}
                                            {orderDetails?.featuredUpgrade ? " + Featured Placement" : ""}
                                        </strong>
                                        {isCreditCheckout ? (
                                            <span>
                                                {creditsPerPackageUnit * quantity}{" "}
                                                {creditsPerPackageUnit * quantity === 1 ? "credit" : "credits"}
                                            </span>
                                        ) : (
                                            <span>{formatCurrency(unitAmountDollars)}</span>
                                        )}
                                    </div>

                                    {isCreditCheckout ? (
                                        <div className={styles.orderItemActions}>
                                            <button
                                                type="button"
                                                className={styles.quantityButton}
                                                aria-label="Decrease quantity"
                                                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                            >
                                                <Minus size={16} strokeWidth={2} />
                                            </button>

                                            <span className={styles.quantityValue}>{quantity}</span>

                                            <button
                                                type="button"
                                                className={styles.quantityButton}
                                                aria-label="Increase quantity"
                                                onClick={() => setQuantity((current) => Math.min(25, current + 1))}
                                            >
                                                <Plus size={16} strokeWidth={2} />
                                            </button>

                                            <strong className={styles.orderLineTotal}>{formatCurrency(subtotal)}</strong>

                                            <button
                                                type="button"
                                                className={styles.removeButton}
                                                aria-label="Remove item"
                                                onClick={() => setQuantity(0)}
                                            >
                                                <X size={20} strokeWidth={2} />
                                            </button>
                                        </div>
                                    ) : orderDetails ? (
                                        <strong className={styles.orderLineTotal}>{formatCurrency(subtotal)}</strong>
                                    ) : (
                                        <div className={styles.orderItemActions}>
                                            <button
                                                type="button"
                                                className={styles.quantityButton}
                                                aria-label="Decrease quantity"
                                                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                            >
                                                <Minus size={16} strokeWidth={2} />
                                            </button>

                                            <span className={styles.quantityValue}>{quantity}</span>

                                            <button
                                                type="button"
                                                className={styles.quantityButton}
                                                aria-label="Increase quantity"
                                                onClick={() => setQuantity((current) => Math.min(25, current + 1))}
                                            >
                                                <Plus size={16} strokeWidth={2} />
                                            </button>

                                            <strong className={styles.orderLineTotal}>{formatCurrency(subtotal)}</strong>

                                            <button
                                                type="button"
                                                className={styles.removeButton}
                                                aria-label="Remove item"
                                                onClick={() => setQuantity(0)}
                                            >
                                                <X size={20} strokeWidth={2} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.emptyOrderState}>
                                    <p>Your order is empty.</p>
                                    <Button
                                        type="button"
                                        variant="join-the-network"
                                        className={styles.restoreButton}
                                        onClick={() => setQuantity(1)}
                                    >
                                        Add Single Release
                                    </Button>
                                </div>
                            )}
                        </section>

                        <section className={styles.card}>
                            <h2>Payment Details</h2>

                            <form
                                id="checkout-payment-form"
                                className={`${styles.form} ${styles.checkoutPaymentForm}`}
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                <FormControl>
                                    <FormLabel htmlFor="checkout-email">Email</FormLabel>
                                    <Input
                                        id="checkout-email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        autoComplete="email"
                                        value={formValues.email}
                                        onChange={(event) => updateField("email", event.target.value)}
                                        aria-invalid={Boolean(fieldErrors.email)}
                                    />
                                    {fieldErrors.email ? <p className={styles.fieldError}>{fieldErrors.email}</p> : null}
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor="checkout-cardholder-name">Cardholder Name</FormLabel>
                                    <Input
                                        id="checkout-cardholder-name"
                                        name="cardholderName"
                                        type="text"
                                        placeholder="John Doe"
                                        autoComplete="cc-name"
                                        value={formValues.cardholderName}
                                        onChange={(event) => updateField("cardholderName", event.target.value)}
                                        aria-invalid={Boolean(fieldErrors.cardholderName)}
                                    />
                                    {fieldErrors.cardholderName ? <p className={styles.fieldError}>{fieldErrors.cardholderName}</p> : null}
                                </FormControl>

                                <FormControl>
                                    <FormLabel id={squareCardLabelId}>Card</FormLabel>
                                    {releaseId && !squarePrereleaseReady ? (
                                        <p className={styles.paymentFieldHint}>
                                            Loading your order so we can activate the secure card field.
                                        </p>
                                    ) : null}
                                    {squarePrereleaseReady ? (
                                        <>
                                            <Suspense fallback={null}>
                                                <CheckoutSquareCardAttacherGate
                                                    key={squareInitAttempt}
                                                    mountSelector={squareMountSelector}
                                                    onCardReady={handleSquareCardReady}
                                                    onSetupFailed={handleSquareSetupFailed}
                                                    onHostCleared={handleSquareHostCleared}
                                                />
                                            </Suspense>
                                            <div
                                                className={styles.squareCardWrap}
                                                role="group"
                                                aria-labelledby={squareCardLabelId}
                                            >
                                                <div
                                                    ref={squareCardHostRef}
                                                    id={`square-card-host-${squareHostDomId}`}
                                                    className={styles.squareCardContainer}
                                                    suppressHydrationWarning
                                                />
                                                {!squareCard ? (
                                                    <div className={styles.squareCardSuspenseOverlay} aria-hidden="true">
                                                        <CheckoutSquareCardSuspenseFallback />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </>
                                    ) : null}
                                    {squarePrereleaseReady && !squareCard && squareLoadMessage ? (
                                        <p className={styles.paymentFieldHint} role="status" aria-live="polite">
                                            {squareLoadMessage}
                                        </p>
                                    ) : null}
                                    {squareRetryStopped ? (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="md"
                                            className={styles.squareRetryButton}
                                            onClick={retrySquareCardLoad}
                                        >
                                            Try loading card again
                                        </Button>
                                    ) : null}
                                </FormControl>
                            </form>
                        </section>
                    </div>

                    <aside className={styles.summaryCard}>
                        <h2>Order Summary</h2>

                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>

                        <div className={styles.summaryRow}>
                            <span>Processing Fee</span>
                            <span>{formatCurrency(0)}</span>
                        </div>

                        <hr className={styles.summaryDivider} />

                        <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
                            <strong>Total</strong>
                            <strong>{formatCurrency(subtotal)}</strong>
                        </div>

                        <Button
                            type="submit"
                            variant="form"
                            className={`${styles.payButton} ${isSubmitting ? styles.payButtonBusy : ""}`}
                            form="checkout-payment-form"
                            disabled={
                                isSubmitting
                                || !squareCard
                                || subtotal === null
                                || releaseOrderError
                                || isReleaseOrderLoading
                            }
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className={styles.payButtonContent}>
                                    <Loader2 className={styles.payButtonSpinner} size={18} aria-hidden />
                                    Processing payment…
                                </span>
                            ) : (
                                subtotal !== null ? `Pay ${formatCurrency(subtotal)}` : "Loading order…"
                            )}
                        </Button>

                        <div className={styles.secureNote}>
                            <Lock size={14} strokeWidth={2} />
                            <span>Your payment information is secure and encrypted</span>
                        </div>

                        {submissionMessage || emptyCartMessage ? (
                            <p className={styles.submissionMessage} role="status" aria-live="polite">
                                {submissionMessage ?? emptyCartMessage}
                            </p>
                        ) : null}
                    </aside>
                </div>
            </Container>
        </section>
    );
}
