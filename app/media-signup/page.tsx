import type { Metadata } from "next";

import { MediaSignUpClientPage } from "@/components/feature/pages";

export const metadata: Metadata = {
    title: "Apply for Early Access",
    description: "Join the Caribbean News media network and apply for early access to the platform.",
    openGraph: {
        title: "Apply for Early Access | Caribbean News",
        description: "Join the Caribbean News media network and apply for early access to the platform.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Apply for Early Access | Caribbean News",
        description: "Join the Caribbean News media network and apply for early access to the platform.",
    },
};

export default async function MediaSignUp() {
    return <MediaSignUpClientPage />;
}
