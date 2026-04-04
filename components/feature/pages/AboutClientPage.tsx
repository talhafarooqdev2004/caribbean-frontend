"use client";

import {
    AboutHeroSection,
    AboutWhatIsCaribNews,
    NotificationNote,
    OurMission,
    WhatMakesUsDifferent,
    WhyWeExist
} from "@/components/composed";

export default function AboutClientPage() {
    return (
        <>
            <AboutHeroSection />
            <AboutWhatIsCaribNews />
            <WhyWeExist />
            <WhatMakesUsDifferent />
            <NotificationNote />
            <OurMission />
        </>
    );
};