"use client";

import {
    ApplyForEarlyAccess,
    BuiltForTheCaribbean,
    JoinTheCaribbeanMediaNetwork,
    MediaPageHowItWorksSection,
    MediaSignUpHeroSection,
    WhatIsCaribNewsWire,
    WhoThisIsFor,
    WhyJoinTheNetwork
} from "@/components/composed";

export default function MediaSignUpClientPage() {
    return (
        <>
            <MediaSignUpHeroSection />
            <WhatIsCaribNewsWire />
            <WhyJoinTheNetwork />
            <WhoThisIsFor />
            <ApplyForEarlyAccess />
            <MediaPageHowItWorksSection />
            <BuiltForTheCaribbean />
            <JoinTheCaribbeanMediaNetwork />
        </>
    );
};