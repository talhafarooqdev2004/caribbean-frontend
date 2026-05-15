"use client";

import { useEffect } from "react";

import {
    ContactUsHeroSection,
    NeedACustomDistributionStrategy,
    SendUsAMessage
} from "@/components/composed";
import { smoothScrollToElement } from "@/utils/scroll";

const CONTACT_US_FORM_SECTION_ID = "contact-us-form";

type ContactUsClientPageProps = {
    proposalIntent?: boolean;
};

export default function ContactUsClientPage({ proposalIntent = false }: ContactUsClientPageProps) {
    useEffect(() => {
        if (!proposalIntent) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            smoothScrollToElement(CONTACT_US_FORM_SECTION_ID);
        }, 100);

        return () => window.clearTimeout(timeoutId);
    }, [proposalIntent]);

    return (
        <>
            <ContactUsHeroSection />
            <SendUsAMessage proposalIntent={proposalIntent} />
            <NeedACustomDistributionStrategy />
        </>
    );
};
