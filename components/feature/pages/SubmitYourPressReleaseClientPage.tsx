"use client";

import { useState } from "react";

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
    const [activeStep, setActiveStep] = useState(1);
    const [expandedStep, setExpandedStep] = useState<number | null>(1);

    return (
        <>
            <SubmitYourPressReleaseHeroSection activeStep={activeStep} />
            <SubmitYourPressReleaseForm
                submitter={submitter}
                initialPackage={selectedPackage}
                activeStep={activeStep}
                expandedStep={expandedStep}
                onStepChange={setActiveStep}
                onExpandedStepChange={setExpandedStep}
            />
        </>
    );
}
