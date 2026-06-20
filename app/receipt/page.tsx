import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderReceiptClientPage } from "@/components/feature/pages";

export const metadata: Metadata = {
    title: "Order Receipt",
    description: "View your Carib Newswire order receipt and payment details.",
    openGraph: {
        title: "Order Receipt | Carib Newswire",
        description: "View your Carib Newswire order receipt and payment details.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Order Receipt | Carib Newswire",
        description: "View your Carib Newswire order receipt and payment details.",
    },
};

export default function ReceiptPage() {
    return (
        <Suspense fallback={null}>
            <OrderReceiptClientPage />
        </Suspense>
    );
}
