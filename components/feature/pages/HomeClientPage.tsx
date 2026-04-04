"use client";

import {
    BrandMetrics,
    HomeHeroSection,
    HowItWorks,
    LatestNews,
    ReadyToShareYourNews,
    WhatIsCaribNewsWire
} from "@/components/composed";

export default function HomeClientPage() {
    return (
        <>
            <HomeHeroSection />
            <BrandMetrics />
            <WhatIsCaribNewsWire />
            <HowItWorks />
            <LatestNews />
            <ReadyToShareYourNews />
        </>
    );
};