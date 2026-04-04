"use client";

import {
    FaqsSection,
    PricingHeroSection,
    ReadyToShareYourStory
} from "@/components/composed";
import PricingSection from "../PricingSection";

export default function PricingClientPage() {
    return (
        <>
            <PricingHeroSection />
            <PricingSection />
            <FaqsSection />
            <ReadyToShareYourStory />
        </>
    );
};