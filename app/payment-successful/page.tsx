import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentSuccessfulClientPage } from "@/components/feature/pages";

export const metadata: Metadata = {
    title: "Payment Successful",
    description: "Your Carib Newswire payment has been confirmed successfully.",
    openGraph: {
        title: "Payment Successful | Carib Newswire",
        description: "Your Carib Newswire payment has been confirmed successfully.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Payment Successful | Carib Newswire",
        description: "Your Carib Newswire payment has been confirmed successfully.",
    },
};

export default async function PaymentSuccessful() {
    return (
        <Suspense fallback={null}>
            <PaymentSuccessfulClientPage />
        </Suspense>
    );
}
