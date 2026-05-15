import type { Metadata } from "next";

import { PrivacyPolicyClientPage } from "@/components/feature/pages";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how Carib Newswire collects, uses, and protects your information.",
    openGraph: {
        title: "Privacy Policy | Carib Newswire",
        description: "Learn how Carib Newswire collects, uses, and protects your information.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy | Carib Newswire",
        description: "Learn how Carib Newswire collects, uses, and protects your information.",
    },
};

export default async function PrivacyPolicy() {
    return <PrivacyPolicyClientPage />;
}
