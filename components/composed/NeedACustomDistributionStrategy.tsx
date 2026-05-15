"use client";

import styles from "./NeedACustomDistributionStrategy.module.scss";

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
            <Container className={styles.distributionStrategyInner}>
                <div className={styles.card}>
                    <h1>Need a Custom Distribution Strategy?</h1>

                    <p>Looking for tailored PR solutions or custom distribution packages? Our team is ready to create a strategy that fits your unique needs.</p>

                    <Button type="button" onClick={handleRequestCustomProposal}>
                        Request Custom Proposal
                    </Button>
                </div>
            </Container>
        </section>
    );
};
