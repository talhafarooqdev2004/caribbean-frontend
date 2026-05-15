"use client";

import {
    TermsOfServiceContent,
    TermsOfServiceHeroSection,
    TermsOfServiceLegalCategories,
} from "@/components/composed";

export default function TermsOfServiceClientPage() {
    return (
        <>
            <TermsOfServiceHeroSection />
            <TermsOfServiceLegalCategories />
            <TermsOfServiceContent />
        </>
    );
}
