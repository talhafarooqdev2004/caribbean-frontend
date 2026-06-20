"use client";

import {
    FaqsSection,
    PricingHeroSection,
    ReadyToShareYourStory
} from "@/components/composed";
import PricingSection from "../PricingSection";
import PricingComparisonSection from "../PricingComparisonSection";

export default function PricingClientPage() {
    return (
        <>
            <PricingHeroSection />
            <PricingSection />
            <PricingComparisonSection />
            <FaqsSection />
            <ReadyToShareYourStory />
        </>
    );
};