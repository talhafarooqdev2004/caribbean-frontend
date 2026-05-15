"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
    BecomeACaribNewaMediaPartner,
    ForMediaNotificationNote,
    ForMediaWhatIsCaribNews,
    ForMediaWhyJoinCaribNews,
    JoinTheMediaNetworkHeroSection,
    StartAccessingQualityCaribbeanNewsToday,
    WhoShouldJoin,
} from "@/components/composed";
import {
    JOIN_MEDIA_NETWORK_FORM_ID,
    consumeJoinMediaNetworkFormIntent,
} from "@/lib/join-media-network-form-intent";

const FORM_HASH = `#${JOIN_MEDIA_NETWORK_FORM_ID}`;
/** Avoid stripping the hash on React Strict Mode’s immediate double effect after a valid open. */
const OPENED_TS_KEY = "carib_join_form_opened_ts";
const OPENED_RECENT_MS = 1500;

function scrollJoinFormIntoView() {
    if (typeof window === "undefined") {
        return;
    }

    window.requestAnimationFrame(() => {
        document.getElementById(JOIN_MEDIA_NETWORK_FORM_ID)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
}

export default function JoinTheMediaNetworkClientPage() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== "/join-the-media-network") {
            return;
        }

        function syncJoinFormHash() {
            if (typeof window === "undefined") {
                return;
            }

            if (window.location.hash !== FORM_HASH) {
                return;
            }

            try {
                const openedTs = Number(sessionStorage.getItem(OPENED_TS_KEY) || "0");
                if (Date.now() - openedTs < OPENED_RECENT_MS) {
                    scrollJoinFormIntoView();
                    return;
                }
            } catch {
                // ignore
            }

            if (!consumeJoinMediaNetworkFormIntent()) {
                window.history.replaceState(null, "", pathname);
                return;
            }

            try {
                sessionStorage.setItem(OPENED_TS_KEY, String(Date.now()));
            } catch {
                // ignore
            }

            scrollJoinFormIntoView();
        }

        syncJoinFormHash();
        window.addEventListener("hashchange", syncJoinFormHash);
        return () => window.removeEventListener("hashchange", syncJoinFormHash);
    }, [pathname]);

    return (
        <>
            <JoinTheMediaNetworkHeroSection />
            <ForMediaWhatIsCaribNews />
            <ForMediaWhyJoinCaribNews />
            <WhoShouldJoin />
            <ForMediaNotificationNote />
            <BecomeACaribNewaMediaPartner />
            <StartAccessingQualityCaribbeanNewsToday />
        </>
    );
}
