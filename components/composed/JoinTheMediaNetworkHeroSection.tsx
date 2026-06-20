"use client";

import styles from "./JoinTheMediaNetworkHeroSection.module.scss";

import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { Container } from "../layout";
import { Button } from "../ui";
import {
    JOIN_MEDIA_NETWORK_FORM_ID,
    armJoinMediaNetworkFormIntent,
} from "@/lib/join-media-network-form-intent";
import {
    type NetworkStatsDisplay,
    type NetworkStatsPayload,
    resolveNetworkStatsDisplay,
} from "@/lib/network-stats";

type StatsLoadState = "loading" | "ready";

const statsMeta = [
    { key: "mediaMembersLabel" as const, label: "Media members", tone: undefined },
    { key: "islandsCoveredLabel" as const, label: "Islands covered", tone: "blue" as const },
    { key: "releasesSentLabel" as const, label: "Releases sent", tone: undefined },
    { key: "distributionRateLabel" as const, label: "Distribution rate", tone: "gold" as const },
];

const networkRoles = [
    "Journalists & reporters",
    "Editors & producers",
    "Digital creators & podcasters",
    "News organizations",
];

type JoinTheMediaNetworkHeroSectionProps = {
    initialNetworkStats?: NetworkStatsPayload | null;
};

function applyNetworkStatsPayload(
    payload: NetworkStatsPayload | null,
    setStats: (stats: NetworkStatsDisplay) => void,
    setLoadState: (state: StatsLoadState) => void,
) {
    setStats(resolveNetworkStatsDisplay(payload));
    setLoadState("ready");
}

export default function JoinTheMediaNetworkHeroSection({
    initialNetworkStats,
}: JoinTheMediaNetworkHeroSectionProps) {
    const hasServerStats = initialNetworkStats !== undefined;
    const [loadState, setLoadState] = useState<StatsLoadState>(hasServerStats ? "ready" : "loading");
    const [stats, setStats] = useState<NetworkStatsDisplay>(() => (
        hasServerStats ? resolveNetworkStatsDisplay(initialNetworkStats) : resolveNetworkStatsDisplay(null)
    ));

    useEffect(() => {
        if (hasServerStats) {
            return;
        }

        const controller = new AbortController();

        void fetch("/api/public/network-stats", { signal: controller.signal })
            .then((response) => (response.ok ? response.json() as Promise<NetworkStatsPayload> : null))
            .then((payload) => {
                if (controller.signal.aborted) {
                    return;
                }

                applyNetworkStatsPayload(payload, setStats, setLoadState);
            })
            .catch(() => {
                if (controller.signal.aborted) {
                    return;
                }

                applyNetworkStatsPayload(null, setStats, setLoadState);
            });

        return () => controller.abort();
    }, [hasServerStats]);

    function handleJoin() {
        armJoinMediaNetworkFormIntent();
        document.getElementById(JOIN_MEDIA_NETWORK_FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleLearnMore() {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: window.innerHeight - 80, behavior: "smooth" });
        }
    }

    const isLoading = loadState === "loading";

    return (
        <section className={styles.heroSection}>
            <div className={styles.sideAccent} aria-hidden="true">
                <svg viewBox="0 0 400 751" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMin slice">
                    <rect width="399.996" height="750.125" fill="url(#joinMediaHeroSideGradient)" />
                    <defs>
                        <linearGradient id="joinMediaHeroSideGradient" x1="0" y1="0" x2="622.88" y2="332.144" gradientUnits="userSpaceOnUse">
                            <stop offset="0.4" stopOpacity="0" />
                            <stop offset="0.4" stopColor="#C4922A" stopOpacity="0.04" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <Container className={styles.heroSectionInner}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>For Media Professionals</span>

                    <h1>Join the <span>Media Network</span></h1>

                    <div className={styles.freePill}>
                        <span className={styles.freeIcon}>
                            <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.6187 0.624512L3.74804 7.4952L0.625 4.37216" stroke="#5899E2" strokeWidth="1.24922" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        Membership for media professionals is free
                    </div>

                    <p>
                        Carib Newswire connects journalists and media professionals across the
                        Caribbean and diaspora with credible news, verified information, and story
                        opportunities.
                    </p>

                    <div className={styles.ctaBtns}>
                        <Button variant="form" className={styles.joinButton} onClick={handleJoin}>
                            Join the Network
                            <ArrowRight size={18} strokeWidth={2} />
                        </Button>
                        <Button variant="join-as-media" className={styles.learnButton} onClick={handleLearnMore}>
                            Learn More
                        </Button>
                    </div>
                </div>

                <div className={styles.statsCard} aria-busy={isLoading}>
                    <div className={styles.statsHeader}>
                        <span className={styles.live}>Network Live</span>
                        <span className={styles.updated}>{isLoading ? "Loading stats..." : "Updated daily"}</span>
                    </div>

                    <div className={styles.statsGrid}>
                        {statsMeta.map((stat) => (
                            <div key={stat.label} className={styles.statBox}>
                                {isLoading ? (
                                    <>
                                        <span className={styles.statSkeletonValue} aria-hidden />
                                        <span className={styles.statSkeletonLabel} aria-hidden />
                                        <span className={styles.srOnly}>{stat.label} loading</span>
                                    </>
                                ) : (
                                    <>
                                        <span className={clsx(styles.statValue, stat.tone === "blue" && styles.valueBlue, stat.tone === "gold" && styles.valueGold)}>
                                            {stats[stat.key]}
                                        </span>
                                        <span className={styles.statLabel}>{stat.label}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {!isLoading && stats.lastReleaseLabel ? (
                        <div className={styles.lastRelease}>{stats.lastReleaseLabel}</div>
                    ) : null}

                    <span className={styles.networkEyebrow}>Who&apos;s in the network</span>

                    <ul className={styles.networkList}>
                        {networkRoles.map((role) => (
                            <li key={role}>{role}</li>
                        ))}
                    </ul>
                </div>
            </Container>

            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path
                        d="M0,120 L1440,120 L1440,52 C1300,48 1180,34 1040,34 C900,34 820,56 680,60 C540,64 460,36 320,36 C200,36 120,46 0,58 Z"
                        fill="#FFFFFF"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </section>
    );
}
