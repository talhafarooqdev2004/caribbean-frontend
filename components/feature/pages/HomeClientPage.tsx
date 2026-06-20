"use client";

import {
    BrandMetrics,
    HomeHeroSection,
    HowItWorks,
    LatestNews,
    ReadyToShareCaribbeanMedia,
    ReadyToShareYourNews,
    Testimonials,
    WhatIsCaribNewsWire
} from "@/components/composed";
import { type PressReleaseRecord } from "@/lib/press-release-types";

type HomeClientPageProps = {
    latestReleases?: PressReleaseRecord[];
};

export default function HomeClientPage({ latestReleases = [] }: HomeClientPageProps) {
    return (
        <>
            <HomeHeroSection latestReleases={latestReleases.slice(0, 3)} />
            <BrandMetrics />
            <WhatIsCaribNewsWire />
            <HowItWorks />
            <LatestNews releases={latestReleases} />
            <Testimonials />
            <ReadyToShareCaribbeanMedia />
            <ReadyToShareYourNews />
        </>
    );
};
