"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import {
    CheckoutDetails,
    CheckoutHeroSection,
} from "@/components/composed";
import { Container } from "@/components/layout";

import styles from "./CheckoutClientPage.module.scss";

type CheckoutClientPageProps = {
    creditPackage?: "single" | "bundle" | null;
};

function CheckoutDetailsFallback() {
    return (
        <Container className={styles.fallback} aria-busy="true" aria-live="polite">
            <Loader2 className={styles.fallbackSpinner} size={22} strokeWidth={2} aria-hidden />
            <span>Loading checkout…</span>
        </Container>
    );
}

export default function CheckoutClientPage({ creditPackage = null }: CheckoutClientPageProps) {
    return (
        <>
            <CheckoutHeroSection />
            <Suspense fallback={<CheckoutDetailsFallback />}>
                <CheckoutDetails creditPackage={creditPackage} />
            </Suspense>
        </>
    );
}
