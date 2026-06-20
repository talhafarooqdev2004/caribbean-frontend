import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { PaymentSuccessfulClientPage } from "@/components/feature/pages";

export const metadata: Metadata = {
    title: "Payment Successful",
    description: "Your Carib Newswire payment was completed successfully.",
    openGraph: {
        title: "Payment Successful | Carib Newswire",
        description: "Your Carib Newswire payment was completed successfully.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Payment Successful | Carib Newswire",
        description: "Your Carib Newswire payment was completed successfully.",
    },
};

type PaymentSuccessfulPageProps = {
    searchParams: Promise<{ orderId?: string; releaseId?: string }>;
};

export default async function PaymentSuccessful({ searchParams }: PaymentSuccessfulPageProps) {
    const params = await searchParams;
    const orderId = typeof params.orderId === "string" ? params.orderId.trim() : "";
    const releaseId = typeof params.releaseId === "string" ? params.releaseId.trim() : "";

    if (orderId && !releaseId) {
        redirect(`/receipt?orderId=${encodeURIComponent(orderId)}`);
    }

    return (
        <Suspense fallback={null}>
            <PaymentSuccessfulClientPage />
        </Suspense>
    );
}
