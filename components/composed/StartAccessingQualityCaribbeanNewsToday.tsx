"use client";

import styles from "./StartAccessingQualityCaribbeanNewsToday.module.scss";

import { ArrowRight, Check, MapPin, Phone, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { Container } from "../layout";
import { Button } from "../ui";
import {
    JOIN_MEDIA_NETWORK_FORM_ID,
    armJoinMediaNetworkFormIntent,
} from "@/lib/join-media-network-form-intent";

const points = [
    { Icon: Check, label: "100% Free for Media", highlighted: true },
    { Icon: ShieldCheck, label: "Verified Content Only" },
    { Icon: MapPin, label: "Regional Focus" },
    { Icon: Phone, label: "Curated Distribution", highlighted: true },
];

export default function StartAccessingQualityCaribbeanNewsToday() {
    function handleJoin() {
        armJoinMediaNetworkFormIntent();
        document.getElementById(JOIN_MEDIA_NETWORK_FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <section className={styles.startAccessing}>
            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z" />
                </svg>
            </div>

            <Container className={styles.startAccessingInner}>
                <div className={styles.card}>
                    <div className={styles.sideAccent} aria-hidden="true">
                        <svg viewBox="0 0 400 751" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMin slice">
                            <rect width="399.996" height="750.125" fill="url(#startAccessingSideGradient)" />
                            <defs>
                                <linearGradient id="startAccessingSideGradient" x1="0" y1="0" x2="622.88" y2="332.144" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.4" stopOpacity="0" />
                                    <stop offset="0.4" stopColor="#C4922A" stopOpacity="0.04" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className={styles.copy}>
                        <span className={styles.eyebrow}>Start Today</span>

                        <h2>Start Accessing Quality <span>Caribbean News Today</span></h2>

                        <p>
                            Join hundreds of media professionals who trust Carib Newswire for credible,
                            verified press releases from across the Caribbean region.
                        </p>

                        <Button className={styles.joinButton} onClick={handleJoin}>
                            Join for Free
                            <ArrowRight size={18} strokeWidth={2} />
                        </Button>
                    </div>

                    <div className={styles.points}>
                        {points.map(({ Icon, label, highlighted }) => (
                            <div key={label} className={clsx(styles.point, highlighted && styles.pointHighlighted)}>
                                <Icon size={16} strokeWidth={2} />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};
