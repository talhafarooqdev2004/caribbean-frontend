"use client";

import {
    SubmitYourPressReleaseForm,
    SubmitYourPressReleaseHeroSection,
} from "@/components/composed";

type SubmitYourPressReleaseClientPageProps = {
    submitter: {
        firstName: string;
        lastName: string;
        email: string;
        organization: string | null;
        phone: string | null;
        credits: number;
        bundleCreditsRemaining?: number;
        permanentCredits?: number;
        packageType: string | null;
    };
    selectedPackage: "single" | "bundle" | "custom" | null;
};

export default function SubmitYourPressReleaseClientPage({
    submitter,
    selectedPackage,
}: SubmitYourPressReleaseClientPageProps) {
    return (
        <>
            <SubmitYourPressReleaseHeroSection />
            <SubmitYourPressReleaseForm submitter={submitter} initialPackage={selectedPackage} />
        </>
    );
}
