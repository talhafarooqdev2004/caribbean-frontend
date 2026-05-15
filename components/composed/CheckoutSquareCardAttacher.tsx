"use client";

import { Loader2 } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

import attacherStyles from "./CheckoutSquareCardAttacher.module.scss";

export type SquareCard = {
    attach: (selector: string) => Promise<void>;
    tokenize: () => Promise<{ status: "OK" | string; token?: string; errors?: Array<{ message?: string }> }>;
    destroy?: () => Promise<void>;
    recalculateSize?: () => void;
};

type SquarePayments = {
    card: (options?: object) => Promise<SquareCard>;
};

// Per Square docs: call recalculateSize() once after attach() so Square can
// measure the container and build its correct internal field hit-map.
// A second call after 300ms catches any async layout shift on slow devices.
// The container CSS must have NO fixed height — Square sets it via the iframe.
function kickSquareCardLayout(card: SquareCard | null | undefined) {
    if (!card?.recalculateSize) {
        return;
    }
    card.recalculateSize();
    window.setTimeout(() => {
        card.recalculateSize?.();
    }, 300);
}

declare global {
    interface Window {
        Square?: {
            payments: (appId: string, locationId: string) => SquarePayments;
        };
    }
}

type SquareWebClientConfig = {
    appId: string | null;
    locationId: string | null;
    sdkUrl: string;
};

let squareWebClientConfigPromise: Promise<SquareWebClientConfig> | null = null;

async function getSquareWebClientConfig(): Promise<SquareWebClientConfig> {
    if (!squareWebClientConfigPromise) {
        squareWebClientConfigPromise = fetch("/api/payments/square/web-client-config", { cache: "no-store" })
            .then(async (response) => {
                const mode = (await response.json()) as SquareWebClientConfig & { data?: SquareWebClientConfig; error?: string };

                if (!response.ok) {
                    throw new Error(mode.error || "Square client config could not be loaded.");
                }

                return mode && typeof mode === "object" && "data" in mode && mode.data ? mode.data : mode;
            })
            .catch((err) => {
                squareWebClientConfigPromise = null;
                throw err instanceof Error ? err : new Error("Square client config could not be loaded.");
            });
    }

    return squareWebClientConfigPromise;
}

export function resetSquareWebClientConfigCache() {
    squareWebClientConfigPromise = null;
}

function waitForSquareGlobal(timeoutMs = 15000): Promise<boolean> {
    if (typeof window === "undefined") return Promise.resolve(false);

    const start = typeof performance !== "undefined" ? performance.now() : Date.now();

    return new Promise((resolve) => {
        function tick() {
            if (window.Square) {
                resolve(true);
                return;
            }

            const elapsed = (typeof performance !== "undefined" ? performance.now() : Date.now()) - start;
            if (elapsed >= timeoutMs) {
                resolve(false);
                return;
            }

            window.requestAnimationFrame(tick);
        }

        tick();
    });
}

async function ensureSquareScriptLoaded(sdkUrl: string): Promise<void> {
    if (typeof document === "undefined") {
        throw new Error("Square SDK can only load in the browser");
    }

    const existing = Array.from(document.getElementsByTagName("script")).some(
        (el) => el.getAttribute("src") === sdkUrl,
    );

    if (!existing) {
        await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = sdkUrl;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Square SDK failed to load"));
            document.body.appendChild(script);
        });
    }

    const ready = await waitForSquareGlobal();
    if (!ready) {
        throw new Error("Square SDK did not become available");
    }
}

async function waitForHostElement(mountSelector: string, maxFrames = 120): Promise<boolean> {
    if (typeof document === "undefined" || typeof window === "undefined") {
        return false;
    }

    for (let i = 0; i < maxFrames; i++) {
        if (document.querySelector(mountSelector)) {
            return true;
        }
        await new Promise<void>((resolve) => {
            window.requestAnimationFrame(() => resolve());
        });
    }

    return false;
}

function clearSquareCardHost(mountSelector: string) {
    if (typeof document === "undefined") {
        return;
    }

    const el = document.querySelector(mountSelector);
    if (el) {
        el.innerHTML = "";
    }
}

// ---------------------------------------------------------------------------
// Square card style options.
//
// fontSize "16px" is mandatory on iOS — anything smaller causes Safari to
// auto-zoom on focus, shifting the viewport and permanently breaking Square's
// field hit-map for that session.
//
// fontFamily must be a single font name. Square rejects CSS font stacks.
// ---------------------------------------------------------------------------
const SQUARE_CARD_OPTIONS = {
    style: {
        input: {
            fontSize: "16px",
            fontFamily: "sans-serif",
            color: "#274060",
        },
        "input::placeholder": {
            color: "#a0aec0",
        },
        ".input-container": {
            borderColor: "#d0d5dd",
            borderRadius: "8px",
        },
        ".input-container.is-focus": {
            borderColor: "#5b95db",
        },
        ".input-container.is-error": {
            borderColor: "#b91c1c",
        },
        ".message-text": {
            color: "#b91c1c",
        },
    },
} as const;

async function loadSquareCardIntoMount(mountSelector: string, signal?: AbortSignal): Promise<SquareCard | null> {
    if (typeof document === "undefined") {
        return null;
    }

    await new Promise<void>((resolve) => {
        queueMicrotask(resolve);
    });

    if (signal?.aborted) {
        return null;
    }

    const hostReady = await waitForHostElement(mountSelector);
    if (!hostReady || signal?.aborted) {
        return null;
    }

    clearSquareCardHost(mountSelector);

    const backoffMs = [0, 900, 2200];
    const maxAttempts = backoffMs.length;

    try {
        const cfg = await getSquareWebClientConfig();

        if (!cfg.appId || !cfg.locationId) {
            throw new Error("Square payment credentials are not configured.");
        }

        let lastError: unknown = new Error("Square card form could not be loaded.");

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (signal?.aborted) {
                return null;
            }

            if (backoffMs[attempt] > 0) {
                await new Promise<void>((resolve) => {
                    window.setTimeout(resolve, backoffMs[attempt]);
                });
            }

            if (signal?.aborted) {
                return null;
            }

            let card: SquareCard | null = null;

            try {
                await ensureSquareScriptLoaded(cfg.sdkUrl);

                if (signal?.aborted) {
                    return null;
                }

                if (!window.Square) {
                    throw new Error("Square SDK is not available");
                }

                const payments = window.Square.payments(cfg.appId, cfg.locationId);
                card = await payments.card(SQUARE_CARD_OPTIONS);

                clearSquareCardHost(mountSelector);

                if (signal?.aborted) {
                    await card.destroy?.().catch(() => null);
                    return null;
                }

                await card.attach(mountSelector);

                if (signal?.aborted) {
                    await card.destroy?.().catch(() => null);
                    return null;
                }

                kickSquareCardLayout(card);

                return card;
            } catch (err) {
                lastError = err;
                if (card) {
                    await card.destroy?.().catch(() => null);
                    card = null;
                }
                clearSquareCardHost(mountSelector);
            }
        }

        throw lastError instanceof Error ? lastError : new Error("Square card form could not be loaded.");
    } catch (err) {
        throw err instanceof Error ? err : new Error("Square card form could not be loaded.");
    }
}

export type CheckoutSquareCardAttacherProps = {
    mountSelector: string;
    onCardReady: (card: SquareCard) => void;
    onSetupFailed: (reason?: string) => void;
    /** Called synchronously when the mount is cleared (effect cleanup, retries, Strict Mode remount). Keeps UI state in sync with the DOM. */
    onHostCleared?: () => void;
};

/**
 * Attaches the Square card iframe to `mountSelector`.
 * Renders nothing; the host element must exist in the document when this mounts.
 */
export function CheckoutSquareCardAttacher({
    mountSelector,
    onCardReady,
    onSetupFailed,
    onHostCleared,
}: CheckoutSquareCardAttacherProps) {
    const abortRef = useRef<AbortController | null>(null);

    useLayoutEffect(() => {
        if (typeof document === "undefined") {
            return undefined;
        }

        const ctrl = new AbortController();
        abortRef.current?.abort();
        abortRef.current = ctrl;
        let cardForCleanup: SquareCard | null = null;

        loadSquareCardIntoMount(mountSelector, ctrl.signal)
            .then((card) => {
                if (ctrl.signal.aborted) {
                    void card?.destroy?.().catch(() => null);
                    return;
                }

                if (!card) {
                    onSetupFailed();
                    return;
                }

                cardForCleanup = card;
                onCardReady(card);
            })
            .catch((err) => {
                if (!ctrl.signal.aborted) {
                    onSetupFailed(err instanceof Error ? err.message : "Square card form could not be loaded.");
                }
            });

        return () => {
            ctrl.abort();
            if (cardForCleanup) {
                void cardForCleanup.destroy?.().catch(() => null);
            }
            clearSquareCardHost(mountSelector);
            onHostCleared?.();
        };
    }, [mountSelector, onCardReady, onSetupFailed, onHostCleared]);

    return null;
}

export function CheckoutSquareCardSuspenseFallback() {
    return (
        <div className={attacherStyles.squareCardSuspenseFallback} aria-busy="true" aria-live="polite">
            <Loader2
                size={22}
                strokeWidth={2}
                aria-hidden
                className={attacherStyles.squareCardSuspenseFallbackSpinner}
            />
            <span>Loading card</span>
        </div>
    );
}