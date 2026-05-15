"use client";

import {
    BrandMetrics,
    HomeHeroSection,
    HowItWorks,
    LatestNews,
    ReadyToShareYourNews,
    WhatIsCaribNewsWire
} from "@/components/composed";
import { type PressReleaseRecord } from "@/lib/press-release-types";

type HomeClientPageProps = {
    latestReleases?: PressReleaseRecord[];
};

export default function HomeClientPage({ latestReleases = [] }: HomeClientPageProps) {
    return (
        <>
            <HomeHeroSection />
            <BrandMetrics />
            <WhatIsCaribNewsWire />
            <HowItWorks />
            <LatestNews releases={latestReleases} />
            <ReadyToShareYourNews />
        </>
    );
};
