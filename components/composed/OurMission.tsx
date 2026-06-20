"use client";

import styles from "./OurMission.module.scss";

import { ArrowRight } from "lucide-react";
import { Container } from "../layout";
import { Button } from "../ui";
import { useRouter } from "next/navigation";
import { pushSubmitPressRelease } from "@/lib/push-submit-press-release";

const pillars = [
    { num: "01", title: "Credibility", description: "Every release is reviewed. Every journalist is vetted. Every distribution is intentional." },
    { num: "02", title: "Regional Focus", description: "The Caribbean is our entire world — not a market segment or an afterthought." },
    { num: "03", title: "Efficiency", description: "48-hour review, clear pricing, no jargon. We respect your time and your story." },
    { num: "04", title: "Transparency", description: "Real analytics, clear workflows, and honest feedback from our editorial team." },
];

export default function OurMission() {
    const router = useRouter();

    return (
        <section className={styles.ourMission}>
            <Container className={styles.ourMissionInner}>
                <div className={styles.detailSection}>
                    <span className={styles.eyebrow}>Our mission</span>

                    <h2>
                        <span>Connecting Caribbean</span>
                        <span>organizations with the</span>
                        <span><em>media that matters.</em></span>
                    </h2>

                    <p>
                        To create a credible, efficient, and region-focused platform that connects
                        Caribbean organizations with the media professionals who matter most.
                    </p>

                    <p>
                        We believe in transparency, editorial integrity, and the power of a well-placed
                        story. Our platform is built on those values — and we hold every submission, every
                        journalist relationship, and every distribution to that standard.
                    </p>

                    <div className={styles.actions}>
                        <Button className={styles.submitReleaseBtn} onClick={() => pushSubmitPressRelease(router)}>
                            Submit a Release
                        </Button>
                        <Button variant="join-the-network" className={styles.viewPricingBtn} onClick={() => router.push("/pricing")}>
                            View Pricing
                            <ArrowRight size={16} strokeWidth={2} />
                        </Button>
                    </div>
                </div>

                <div className={styles.pillarsCard}>
                    <span className={styles.pillarsEyebrow}>Our core pillars</span>

                    <ul className={styles.pillars}>
                        {pillars.map((pillar) => (
                            <li key={pillar.num} className={styles.pillar}>
                                <span className={styles.pillarNumber}>{pillar.num}</span>
                                <div>
                                    <h3>{pillar.title}</h3>
                                    <p>{pillar.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
};
