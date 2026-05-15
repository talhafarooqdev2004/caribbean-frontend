"use client";

import styles from "./PricingSection.module.scss";

import { Container } from "../layout";
import React from "react";
import { Button, SvgIcon } from "../ui";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

export default function PricingSection() {
    const router = useRouter();

    function startPackageCheckout(packageId: "single" | "bundle") {
        window.sessionStorage.removeItem("carib_checkout_session_id");
        window.sessionStorage.removeItem("carib_selected_package");
        window.sessionStorage.removeItem("carib_submission_form");
        window.sessionStorage.removeItem("carib_total_amount");
        router.push(`/checkout?package=${packageId}`);
    }

    return (
        <section className={styles.pricingSection}>
            <Container className={styles.pricingSectionInner}>
                <PricingList>
                    <Package className={styles.singleReleasePackage}>
                        <Package.Name>Single Release</Package.Name>

                        <Package.Price>$149</Package.Price>

                        <Package.Description>Perfect for one-time announcements, launches, and event promotions.</Package.Description>

                        <Package.SummaryList>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                Up to 700 words
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                1 cover image
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                1 outbound link
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                Targeted journalist distribution
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                Newsroom publication
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                48-hour editorial review
                            </Package.SummaryItem>
                        </Package.SummaryList>

                        <Button size="md" onClick={() => startPackageCheckout("single")}>Submit Your Release</Button>
                    </Package>

                    <Package className={styles.threeReleasePackage}>
                        <Package.Badge>Best Value</Package.Badge>

                        <Package.Name>3-Release Package</Package.Name>

                        <Package.Price>$399</Package.Price>

                        <Package.Description>Built for seasonal campaigns, event cycles, and growing brands.</Package.Description>

                        <Package.SummaryList>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                Everything in Single Release
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                3 total release credits
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                Flexible scheduling
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                Use across multiple campaigns
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="soft-blue-tick" />
                                Credit validity for 6 months
                            </Package.SummaryItem>
                        </Package.SummaryList>

                        <Button size="md" onClick={() => startPackageCheckout("bundle")}>Purchase Release Pack</Button>
                    </Package>

                    <Package className={styles.featuredPlacement}>
                        <Package.Name>
                            <SvgIcon icon="star" />
                            Featured Placement
                        </Package.Name>

                        <Package.Price>+$99</Package.Price>

                        <Package.Description>Add to any release for premium positioning.</Package.Description>

                        <Package.SummaryList>
                            <Package.SummaryItem>
                                <SvgIcon icon="yellow-tick" />
                                Homepage spotlight placement (48 hours)
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="yellow-tick" />
                                Priority editorial review
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="yellow-tick" />
                                Top-of-email distribution positioning
                            </Package.SummaryItem>

                            <Package.Description>Designed for major announcements and high-impact campaigns.</Package.Description>
                        </Package.SummaryList>
                    </Package>

                    <Package className={styles.professionalCampaigns}>
                        <Package.Name>
                            Professional Campaigns
                        </Package.Name>

                        <Package.Price>$999+</Package.Price>

                        <Package.Description>For established brands and agencies</Package.Description>

                        <Package.SummaryList>
                            <Package.SummaryItem>
                                <SvgIcon icon="greyish-tick" />
                                Multi-release campaign distribution
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="greyish-tick" />
                                Custom island & diaspora targeting
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="greyish-tick" />
                                Coordinated scheduling
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="greyish-tick" />
                                Campaign performance summary
                            </Package.SummaryItem>
                            <Package.SummaryItem>
                                <SvgIcon icon="greyish-tick" />
                                Dedicated support
                            </Package.SummaryItem>

                            <Package.Description>Designed for major announcements and high-impact campaigns.</Package.Description>
                        </Package.SummaryList>

                        <Button size="md" onClick={() => router.push("/contact-us?for=proposal")}>Request a Proposal</Button>
                    </Package>
                </PricingList>
            </Container>
        </section>
    );
};

function PricingList({ children }: React.PropsWithChildren) {
    return <div className={styles.pricingList}>{children}</div>;
}

const Package = function PricingPackage({ children, className }: React.PropsWithChildren<{ className?: string }>) {
    return <div className={clsx(styles.package, className)}>{children}</div>;
};

Package.Badge = function PackageBadge({ children }: React.PropsWithChildren) {
    return <span className={styles.packageBadge}>{children}</span>;
};

Package.Name = function PackageName({ children }: React.PropsWithChildren) {
    return <span className={styles.packageName}>{children}</span>
};

Package.Price = function PackagePrice({ children }: React.PropsWithChildren) {
    return <h1 className={styles.packagePrice}>{children}</h1>
};

Package.Description = function PackageDescription({ children }: React.PropsWithChildren) {
    return <p className={styles.packageDescription}>{children}</p>;
};

Package.SummaryList = function PackageSummaryList({ children }: React.PropsWithChildren) {
    return <ul className={styles.packageSummaryList}>{children}</ul>;
};

Package.SummaryItem = function PackageSummaryItem({ children }: React.PropsWithChildren) {
    return <li className={styles.summaryItem}>{children}</li>;
};
