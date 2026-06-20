"use client";

import styles from "./NeedACustomDistributionStrategy.module.scss";

import { SendHorizontal } from "lucide-react";
import { Container } from "../layout";
import { Button } from "../ui";
import { usePathname, useRouter } from "next/navigation";
import { smoothScrollToElement } from "@/utils/scroll";

const CONTACT_US_FORM_SECTION_ID = "contact-us-form";

export default function NeedACustomDistributionStrategy() {
    const router = useRouter();
    const pathname = usePathname();

    function handleRequestCustomProposal() {
        if (pathname === "/contact-us") {
            smoothScrollToElement(CONTACT_US_FORM_SECTION_ID);
            const hasProposalQuery = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("for") === "proposal";
            if (!hasProposalQuery) {
                router.replace("/contact-us?for=proposal", { scroll: false });
            }
            return;
        }

        router.push("/contact-us?for=proposal");
    }

    return (
        <section className={styles.distributionStrategy}>
            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path
                        d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z"
                        fill="#FFFFFF"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div className={styles.navyContent}>
                <div className={styles.decor} aria-hidden="true">
                    <span className={styles.ringTop} />
                    <span className={styles.ringBottom} />
                </div>

                <Container className={styles.distributionStrategyInner}>
                    <div className={styles.copy}>
                        <span className={styles.eyebrow}>Custom Strategy</span>

                        <h2>Need a Custom <span>Distribution Strategy?</span></h2>

                        <p>
                            Looking for tailored PR solutions or custom distribution packages? Our team is
                            ready to create a strategy that fits your unique needs — whether you&apos;re a
                            government agency, large enterprise, or diaspora media group.
                        </p>
                    </div>

                    <Button type="button" className={styles.proposalButton} onClick={handleRequestCustomProposal}>
                        Request Custom Proposal
                        <SendHorizontal size={18} strokeWidth={2} />
                    </Button>
                </Container>
            </div>
        </section>
    );
};
