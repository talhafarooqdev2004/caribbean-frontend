"use client";

import styles from "./CheckoutDetails.module.scss";

import { Check, Loader2, Lock, Monitor, Wallet } from "lucide-react";
import { Suspense, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Container } from "../layout";
import { Button, FormControl, FormLabel, Input, Select } from "../ui";
import { territoryOptions } from "@/lib/enquiry-options";
import {
    CheckoutSquareCardAttacher,
    CheckoutSquareCardSuspenseFallback,
    resetSquareWebClientConfigCache,
    type SquareCard,
} from "./CheckoutSquareCardAttacher";
import CheckoutPaymentSuccessModal from "./CheckoutPaymentSuccessModal";

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
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    country: string;
};

const CHECKOUT_QUANTITY = 1;

const countryOptions = [
    { value: "", label: "Select country / territory" },
    ...territoryOptions.map((option) => ({ value: option.value, label: option.label })),
];

function matchCountryFromLocation(location: string) {
    const normalized = location.trim().toLowerCase();

    if (!normalized) {
        return "";
    }

    const match = territoryOptions.find(
        (option) =>
            option.value === normalized
            || option.label.toLowerCase() === normalized
            || normalized.includes(option.label.toLowerCase()),
    );

    return match?.value ?? "";
}

const initialFormValues: CheckoutFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    country: "",
};

function formatCurrency(value: number | null) {
    if (value === null || Number.isNaN(value)) {
        return "—";
    }

    return `$${value}`;
}

function formatCurrencyDetailed(value: number | null) {
    if (value === null || Number.isNaN(value)) {
        return "—";
    }

    return `$${value.toFixed(2)}`;
}

function getPackageTitle(packageId: string | undefined, featuredUpgrade: boolean) {
    const base =
        packageId === "bundle"
            ? "3-Release Package"
            : packageId === "custom"
                ? "Professional Campaign"
                : "Single Release";

    return featuredUpgrade ? `${base} + Featured Placement` : base;
}

function getPackageSubtitle(packageId: string | undefined) {
    if (packageId === "custom") {
        return "Multi-island campaign distribution";
    }

    return "Caribbean-wide distribution";
}

const SINGLE_INCLUDED_ITEMS = [
    "Up to 700 words",
    "Up to 2 images",
    "1 outbound link",
    "Targeted journalist distribution",
    "Newsroom publication",
    "48-hour editorial review",
] as const;

const BUNDLE_INCLUDED_ITEMS = [
    "Everything in Single Release",
    "3 total release credits",
    "Flexible scheduling",
    "Use across multiple campaigns",
    "Credit validity for 6 months",
] as const;

const CUSTOM_INCLUDED_ITEMS = [
    "Multi-release campaign distribution",
    "Custom island & diaspora targeting",
    "Coordinated scheduling",
    "Campaign performance summary",
    "Dedicated support",
] as const;

const FEATURED_INCLUDED_ITEMS = [
    "Homepage spotlight (48 hours)",
    "Priority editorial review",
    "Top-of-email distribution",
] as const;

function getIncludedItems(packageId: string | undefined, featuredUpgrade: boolean) {
    let items: readonly string[] = [];

    switch (packageId) {
        case "bundle":
            items = BUNDLE_INCLUDED_ITEMS;
            break;
        case "custom":
            items = CUSTOM_INCLUDED_ITEMS;
            break;
        case "single":
            items = SINGLE_INCLUDED_ITEMS;
            break;
        default:
            items = [];
            break;
    }

    if (featuredUpgrade) {
        return [...items, ...FEATURED_INCLUDED_ITEMS];
    }

    return [...items];
}

const DEFAULT_PAYMENT_ERROR = "We could not complete your payment. Please try again.";
const MAX_SQUARE_SETUP_RETRIES = 3;
/** Match site `md` breakpoint — card entry is desktop-only until mobile Square is fixed. */
const MOBILE_CHECKOUT_MAX_WIDTH_PX = 767;

/** Keep checkout copy short; raw SDK strings are noisy and not helpful for buyers. */
function briefSquareLoadDetail(reason?: string): string | undefined {
    if (!reason?.trim()) {
        return undefined;
    }

    const r = reason.toLowerCase();
    if (
        r.includes("initialized in time")
        || r.includes("main-iframe")
        || r.includes("squarecdn.com")
        || r.includes("403")
        || r.includes("forbidden")
        || r.includes("square sdk failed")
        || r.includes("did not become available")
    ) {
        return undefined;
    }

    if (reason.length > 72) {
        return `${reason.slice(0, 69)}…`;
    }

    return reason;
}

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
    const normalizedValues = {
        firstName: values.firstName.trim().replace(/\s+/g, " "),
        lastName: values.lastName.trim().replace(/\s+/g, " "),
        email: values.email.trim().toLowerCase(),
        organization: values.organization.trim().replace(/\s+/g, " "),
        country: values.country.trim(),
    };

    const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

    if (!normalizedValues.firstName) {
        errors.firstName = "First name is required.";
    }

    if (!normalizedValues.lastName) {
        errors.lastName = "Last name is required.";
    }

    if (!normalizedValues.email) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValues.email)) {
        errors.email = "Enter a valid email address.";
    }

    const cardholderName = `${normalizedValues.firstName} ${normalizedValues.lastName}`.trim();

    return {
        values: Object.keys(errors).length > 0
            ? null
            : {
                ...normalizedValues,
                cardholderName,
            },
        errors,
    };
}

type CheckoutDetailsProps = {
    creditPackage?: "single" | "bundle" | null;
};

export default function CheckoutDetails({ creditPackage = null }: CheckoutDetailsProps) {
    const searchParams = useSearchParams();
    const squareHostDomId = useId().replace(/[^a-zA-Z0-9_-]/g, "") || "host";
    const squareMountSelector = `#square-card-host-${squareHostDomId}`;
    const squareCardLabelId = `checkout-square-card-label-${squareHostDomId}`;

    const releaseId = searchParams.get("releaseId");
    const checkoutSessionId = searchParams.get("checkoutSessionId");
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
    const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
    const [isMobileCheckout, setIsMobileCheckout] = useState(false);
    const squareLoadFailuresRef = useRef(0);
    const squareCardHostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        squareLoadFailuresRef.current = 0;
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_CHECKOUT_MAX_WIDTH_PX}px)`);
        const syncViewport = () => setIsMobileCheckout(mediaQuery.matches);

        syncViewport();
        mediaQuery.addEventListener("change", syncViewport);

        return () => mediaQuery.removeEventListener("change", syncViewport);
    }, []);

    useEffect(() => {
        const paymentSuccess = searchParams.get("paymentSuccess");
        const successId = searchParams.get("orderId")?.trim();
        if (paymentSuccess === "1" && successId) {
            setSuccessOrderId(successId);
        }
    }, [searchParams]);

    useEffect(() => {
        let cancelled = false;

        async function prefillLoggedInUser() {
            try {
                const meResponse = await fetch("/api/auth/me", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!meResponse.ok || cancelled) {
                    return;
                }

                const mePayload = await meResponse.json() as {
                    user?: {
                        firstName?: string;
                        lastName?: string;
                        email?: string;
                        organization?: string | null;
                        country?: string | null;
                        journalistProfile?: {
                            location?: string | null;
                        } | null;
                    };
                };

                const user = mePayload.user;
                if (!user || cancelled) {
                    return;
                }

                const profileCountry = matchCountryFromLocation(user.journalistProfile?.location?.trim() ?? "");

                setFormValues((current) => ({
                    firstName: current.firstName || user.firstName?.trim() || "",
                    lastName: current.lastName || user.lastName?.trim() || "",
                    email: current.email || user.email?.trim().toLowerCase() || "",
                    organization: current.organization || user.organization?.trim() || "",
                    country: current.country || user.country?.trim() || profileCountry,
                }));
            } catch {

            }
        }

        void prefillLoggedInUser();

        return () => {
            cancelled = true;
        };
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
            setSquareLoadMessage("Payments are not configured on the server. Please try again later.");
            setSquareRetryStopped(true);
            return;
        }

        if (failures >= MAX_SQUARE_SETUP_RETRIES) {
            setSquareRetryStopped(true);
            const detail = briefSquareLoadDetail(reason);
            setSquareLoadMessage(
                detail ? `We couldn’t load the card field. ${detail}` : "We couldn’t load the card field. Tap Try again.",
            );
            return;
        }

        const detail = briefSquareLoadDetail(reason);
        setSquareLoadMessage(
            detail ? `Loading card field… retrying. (${detail})` : "Loading card field… retrying.",
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

        return {
            packageId: creditPackage,
            amountCents: unitCents * CHECKOUT_QUANTITY + (creditFeaturedFromSession ? 9900 : 0),
            featuredUpgrade: creditFeaturedFromSession,
        };
    }, [releaseId, creditPackage, creditFeaturedFromSession]);

    const orderDetails = releaseId ? releaseOrderDetails : creditOrderDetails;
    const isCreditCheckout = Boolean(creditPackage && !releaseId && orderDetails);

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

        return null;
    }, [orderDetails, releaseId, isCreditCheckout, unitAmountDollars]);

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

        if (isMobileCheckout) {
            setSubmissionMessage(null);
            setToast({
                message: "Card payments are temporarily available on desktop only. Please open checkout on a PC or laptop.",
            });
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
                            quantity: CHECKOUT_QUANTITY,
                            featuredAddon: orderDetails.featuredUpgrade,
                            amount: subtotal,
                            email: validation.values.email,
                            cardholderName: validation.values.cardholderName,
                            organization: validation.values.organization || null,
                            country: validation.values.country || null,
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
                            organization: validation.values.organization || null,
                            country: validation.values.country || null,
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

            setSuccessOrderId(String(orderId));
        } catch {
            setToast({ message: DEFAULT_PAYMENT_ERROR });
        } finally {
            setIsSubmitting(false);
        }
    }

    const packageTitle = getPackageTitle(orderDetails?.packageId, Boolean(orderDetails?.featuredUpgrade));
    const packageSubtitle = getPackageSubtitle(orderDetails?.packageId);
    const includedItems = getIncludedItems(orderDetails?.packageId, Boolean(orderDetails?.featuredUpgrade));

    return (
        <section className={styles.checkoutSection}>
            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z" />
                </svg>
            </div>

            <Container className={styles.checkoutInner}>
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
                        <section className={styles.billingCard}>
                            <header className={styles.billingHeader}>
                                <span className={styles.billingHeaderIcon} aria-hidden>
                                    <Wallet size={18} strokeWidth={1.8} />
                                </span>
                                <div>
                                    <h2>Billing Information</h2>
                                    <p>Your details are secured and encrypted</p>
                                </div>
                            </header>

                            <div className={styles.billingBody}>
                                <form
                                    id="checkout-payment-form"
                                    className={`${styles.form} ${styles.checkoutPaymentForm}`}
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <div className={styles.formSection}>
                                        <span className={styles.sectionEyebrow}>Contact Details</span>

                                        <div className={styles.formRow}>
                                            <FormControl>
                                                <FormLabel htmlFor="checkout-first-name">
                                                    First Name <span className={styles.required}>*</span>
                                                </FormLabel>
                                                <Input
                                                    id="checkout-first-name"
                                                    name="firstName"
                                                    type="text"
                                                    placeholder="First name"
                                                    autoComplete="given-name"
                                                    value={formValues.firstName}
                                                    onChange={(event) => updateField("firstName", event.target.value)}
                                                    aria-invalid={Boolean(fieldErrors.firstName)}
                                                />
                                                {fieldErrors.firstName ? <p className={styles.fieldError}>{fieldErrors.firstName}</p> : null}
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel htmlFor="checkout-last-name">
                                                    Last Name <span className={styles.required}>*</span>
                                                </FormLabel>
                                                <Input
                                                    id="checkout-last-name"
                                                    name="lastName"
                                                    type="text"
                                                    placeholder="Last name"
                                                    autoComplete="family-name"
                                                    value={formValues.lastName}
                                                    onChange={(event) => updateField("lastName", event.target.value)}
                                                    aria-invalid={Boolean(fieldErrors.lastName)}
                                                />
                                                {fieldErrors.lastName ? <p className={styles.fieldError}>{fieldErrors.lastName}</p> : null}
                                            </FormControl>
                                        </div>

                                        <FormControl>
                                            <FormLabel htmlFor="checkout-email">
                                                Email Address <span className={styles.required}>*</span>
                                            </FormLabel>
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
                                            <FormLabel htmlFor="checkout-organization">Organization</FormLabel>
                                            <Input
                                                id="checkout-organization"
                                                name="organization"
                                                type="text"
                                                placeholder="Your organization name"
                                                autoComplete="organization"
                                                value={formValues.organization}
                                                onChange={(event) => updateField("organization", event.target.value)}
                                                aria-invalid={Boolean(fieldErrors.organization)}
                                            />
                                            {fieldErrors.organization ? <p className={styles.fieldError}>{fieldErrors.organization}</p> : null}
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel htmlFor="checkout-country">Country / Territory</FormLabel>
                                            <Select
                                                id="checkout-country"
                                                name="country"
                                                options={countryOptions}
                                                value={formValues.country}
                                                onChange={(event) => updateField("country", event.target.value)}
                                                aria-invalid={Boolean(fieldErrors.country)}
                                            />
                                            {fieldErrors.country ? <p className={styles.fieldError}>{fieldErrors.country}</p> : null}
                                        </FormControl>
                                    </div>

                                    <div className={styles.formSection}>
                                        <span className={styles.sectionEyebrow}>Payment Method</span>

                                        {isMobileCheckout ? (
                                            <div className={styles.mobilePaymentNotice} role="status" aria-live="polite">
                                                <span className={styles.mobilePaymentNoticeIcon} aria-hidden>
                                                    <Monitor size={22} strokeWidth={1.8} />
                                                </span>
                                                <div>
                                                    <strong>Please complete payment on a computer</strong>
                                                    <p>
                                                        We&apos;re sorry — secure card payments aren&apos;t available on
                                                        mobile devices right now. To finish your order, open this page on
                                                        a PC or laptop. Your package and details will be ready when you
                                                        return.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {releaseId && !squarePrereleaseReady ? (
                                                    <p className={styles.paymentFieldHint}>
                                                        Loading your order so we can activate the secure card field.
                                                    </p>
                                                ) : null}
                                                {squarePrereleaseReady ? (
                                                    <>
                                                        <span id={squareCardLabelId} className={styles.visuallyHidden}>Card</span>
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
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>

                    <aside className={styles.summaryCard}>
                        <header className={styles.summaryHeader}>
                            <span className={styles.summaryEyebrow}>Order Summary</span>
                            <h2>Your Package</h2>
                        </header>

                        <div className={styles.summaryBody}>
                            {isReleaseOrderLoading ? (
                                <div className={styles.orderLoading} role="status" aria-live="polite">
                                    <Loader2 className={styles.orderLoadingSpinner} size={20} strokeWidth={2} aria-hidden />
                                    <span>Loading your order…</span>
                                </div>
                            ) : releaseId && releaseOrderError ? (
                                <p className={styles.orderLoadError}>
                                    We could not load this order. Return to the submit page and try again, or contact support.
                                </p>
                            ) : orderDetails ? (
                                <div className={styles.packageRow}>
                                    <div className={styles.packageInfo}>
                                        <strong>{packageTitle}</strong>
                                        <span>{packageSubtitle}</span>
                                    </div>
                                    <strong className={styles.packagePrice}>{formatCurrency(subtotal)}</strong>
                                </div>
                            ) : (
                                <p className={styles.emptyOrderState}>
                                    {emptyCartMessage ?? "Your order is loading."}
                                </p>
                            )}

                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>{formatCurrencyDetailed(subtotal)}</span>
                            </div>

                            <div className={styles.summaryRow}>
                                <span>Tax</span>
                                <span>{formatCurrencyDetailed(0)}</span>
                            </div>

                            <hr className={styles.summaryDivider} />

                            <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
                                <strong>Total</strong>
                                <strong>{formatCurrency(subtotal)}</strong>
                            </div>

                            {includedItems.length > 0 ? (
                                <div className={styles.includedSection}>
                                    <span className={styles.includedEyebrow}>What&apos;s Included</span>
                                    <ul className={styles.includedList}>
                                        {includedItems.map((item) => (
                                            <li key={item}>
                                                <Check size={14} strokeWidth={2.5} aria-hidden />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            <Button
                                type="submit"
                                variant="form"
                                className={`${styles.payButton} ${isSubmitting ? styles.payButtonBusy : ""}`}
                                form="checkout-payment-form"
                                disabled={
                                    isSubmitting
                                    || isMobileCheckout
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
                                    <span className={styles.payButtonContent}>
                                        <Lock size={16} strokeWidth={2} aria-hidden />
                                        {subtotal !== null ? `Pay ${formatCurrency(subtotal)} Now` : "Loading order…"}
                                    </span>
                                )}
                            </Button>

                            <div className={styles.secureNote}>
                                <Lock size={14} strokeWidth={2} aria-hidden />
                                <span>
                                    {isMobileCheckout
                                        ? "Card payments are available on desktop browsers only for now."
                                        : "256-bit SSL encrypted"}
                                </span>
                            </div>

                            {submissionMessage || emptyCartMessage ? (
                                <p className={styles.submissionMessage} role="status" aria-live="polite">
                                    {submissionMessage ?? emptyCartMessage}
                                </p>
                            ) : null}
                        </div>
                    </aside>
                </div>
            </Container>

            {successOrderId ? <CheckoutPaymentSuccessModal orderId={successOrderId} /> : null}
        </section>
    );
}
