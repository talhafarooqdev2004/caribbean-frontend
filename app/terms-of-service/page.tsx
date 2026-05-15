import type { Metadata } from "next";

import { TermsOfServiceClientPage } from "@/components/feature/pages";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Review the terms that govern the use of Carib Newswire and its services.",
    openGraph: {
        title: "Terms of Service | Carib Newswire",
        description: "Review the terms that govern the use of Carib Newswire and its services.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Terms of Service | Carib Newswire",
        description: "Review the terms that govern the use of Carib Newswire and its services.",
    },
};

export default async function TermsOfService() {
    return <TermsOfServiceClientPage />;
}
