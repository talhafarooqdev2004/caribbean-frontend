"use client";

import { useEffect, useState } from "react";

import {
    SubmitYourPressReleaseForm,
    SubmitYourPressReleaseHeroSection,
} from "@/components/composed";
import { CHECKOUT_PAYMENTS_UNAVAILABLE } from "@/lib/checkout-payments-unavailable";

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
    const [expandedStep, setExpandedStep] = useState<number | null>(
        CHECKOUT_PAYMENTS_UNAVAILABLE ? null : 1,
    );

    useEffect(() => {
        if (CHECKOUT_PAYMENTS_UNAVAILABLE) {
            setExpandedStep(null);
        }
    }, []);

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
