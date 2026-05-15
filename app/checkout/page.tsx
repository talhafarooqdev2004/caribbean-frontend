import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutClientPage } from "@/components/feature/pages";
import { getSubmitterSessionUser } from "@/lib/submitter-auth";

export const metadata: Metadata = {
    title: "Checkout",
    description: "Review your order and complete your Carib Newswire checkout securely.",
    openGraph: {
        title: "Checkout | Carib Newswire",
        description: "Review your order and complete your Carib Newswire checkout securely.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Checkout | Carib Newswire",
        description: "Review your order and complete your Carib Newswire checkout securely.",
    },
};

type CheckoutPageProps = {
    searchParams: Promise<{ package?: string; releaseId?: string; checkoutSessionId?: string }>;
};

export default async function Checkout({ searchParams }: CheckoutPageProps) {
    const params = await searchParams;
    const creditPackage = params.package === "bundle" || params.package === "single" ? params.package : null;
    const releaseIdParam =
        typeof params.releaseId === "string" && params.releaseId.trim().length > 0 ? params.releaseId.trim() : null;
    const user = await getSubmitterSessionUser();

    if (releaseIdParam && !user) {
        redirect(`/login?next=${encodeURIComponent(`/checkout?releaseId=${encodeURIComponent(releaseIdParam)}`)}`);
    }

    if (creditPackage && !user) {
        const sessionQuery =
            typeof params.checkoutSessionId === "string" && params.checkoutSessionId.trim().length > 0
                ? `&checkoutSessionId=${encodeURIComponent(params.checkoutSessionId.trim())}`
                : "";
        redirect(`/login?next=${encodeURIComponent(`/checkout?package=${creditPackage}${sessionQuery}`)}`);
    }

    return <CheckoutClientPage creditPackage={creditPackage} />;
}
