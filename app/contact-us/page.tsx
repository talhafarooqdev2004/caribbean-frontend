import type { Metadata } from "next";

import { ContactUsClientPage } from "@/components/feature/pages";

type ContactUsPageProps = {
    searchParams?: Promise<{ for?: string }>;
};

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Carib Newswire for support, partnerships, and general inquiries.",
    openGraph: {
        title: "Contact Us | Carib Newswire",
        description: "Get in touch with Carib Newswire for support, partnerships, and general inquiries.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | Carib Newswire",
        description: "Get in touch with Carib Newswire for support, partnerships, and general inquiries.",
    },
};

export default async function ContactUs({ searchParams }: ContactUsPageProps) {
    const resolved = searchParams ? await searchParams : {};
    const proposalIntent = resolved.for === "proposal";

    return <ContactUsClientPage proposalIntent={proposalIntent} />;
}
