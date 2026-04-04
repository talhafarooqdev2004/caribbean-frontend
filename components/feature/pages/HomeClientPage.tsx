"use client";

import { Footer, Header } from "@/components/layout";
import HeroSection from "../HeroSection";
import {
    BrandMetrics,
    HowItWorks,
    LatestNews,
    ReadyToShareYourNews,
    WhatIsCaribNewsWire
} from "@/components/composed";

export default function HomeClientPage() {
    return (
        <>
            <Header />
            <HeroSection />
            <BrandMetrics />
            <WhatIsCaribNewsWire />
            <HowItWorks />
            <LatestNews />
            <ReadyToShareYourNews />
            <Footer />
        </>
    );
};