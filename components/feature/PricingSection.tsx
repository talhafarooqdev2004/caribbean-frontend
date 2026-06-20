"use client";

import styles from "./PricingSection.module.scss";

import { Container } from "../layout";
import React from "react";
import { Button, SvgIcon } from "../ui";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { prefetchPackageCheckoutLogin, pushPackageCheckout } from "@/lib/push-package-checkout";

export default function PricingSection() {
    const router = useRouter();

    React.useEffect(() => {
        prefetchPackageCheckoutLogin(router, "single");
        prefetchPackageCheckoutLogin(router, "bundle");
    }, [router]);

    function startPackageCheckout(packageId: "single" | "bundle") {
        pushPackageCheckout(router, packageId);
    }

    return (
        <section className={styles.pricingSection}>
            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path
                        d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z"
                        fill="#172840"
                        stroke="#172840"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <Container className={styles.pricingSectionInner}>
                <header className={styles.sectionHeader}>
                    <span className={styles.eyebrow}>Choose your plan</span>
                    <p>All options include editorial review, Caribbean distribution, and newsroom publication.</p>
                </header>

                <PricingList>
                    <Package className={styles.singleReleasePackage}>
                        <Package.Name>Single Release</Package.Name>

                        <Package.Price unit="per release"><span className={styles.currency}>$</span>149</Package.Price>

                        <Package.Description>Perfect for one-time announcements, launches, and event promotions.</Package.Description>

                        <Package.SummaryList>
                            <Package.SummaryItem>Up to 700 words</Package.SummaryItem>
                            <Package.SummaryItem>Up to 2 images</Package.SummaryItem>
                            <Package.SummaryItem>1 outbound link</Package.SummaryItem>
                            <Package.SummaryItem>Targeted journalist distribution</Package.SummaryItem>
                            <Package.SummaryItem>Newsroom publication</Package.SummaryItem>
                            <Package.SummaryItem>48-hour editorial review</Package.SummaryItem>
                        </Package.SummaryList>

                        <Button variant="outline-black" size="md" onClick={() => startPackageCheckout("single")}>Submit Your Release</Button>
                    </Package>

                    <Package className={styles.threeReleasePackage}>
                        <Package.Badge>Best Value</Package.Badge>

                        <Package.Name>3-Release Package</Package.Name>

                        <Package.Price unit="Valid for 6 months"><span className={styles.currency}>$</span>399</Package.Price>

                        <span className={styles.savings}>≈ $133 per release — save $114</span>

                        <Package.Description>Built for seasonal campaigns, event cycles, and growing brands.</Package.Description>

                        <Package.SummaryList>
                            <Package.SummaryItem>Everything in Single Release</Package.SummaryItem>
                            <Package.SummaryItem>3 total release credits</Package.SummaryItem>
                            <Package.SummaryItem>Flexible scheduling</Package.SummaryItem>
                            <Package.SummaryItem>Use across multiple campaigns</Package.SummaryItem>
                            <Package.SummaryItem>Credit validity for 6 months</Package.SummaryItem>
                        </Package.SummaryList>

                        <Button variant="primary" size="md" onClick={() => startPackageCheckout("bundle")}>Purchase Release Pack</Button>
                    </Package>

                    <Package className={styles.featuredPlacement}>
                        <Package.Name>
                            <span className={styles.iconBox}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.9939 1.16602L8.79531 4.81549L12.8237 5.4043L9.90881 8.24343L10.5967 12.2544L6.9939 10.3597L3.39106 12.2544L4.07898 8.24343L1.16406 5.4043L5.19248 4.81549L6.9939 1.16602Z" fill="#C4922A" />
                                </svg>
                            </span>
                            Featured Placement
                        </Package.Name>

                        <Package.Price unit="add-on per release"><span className={styles.currencyPlus}>+</span> <span className={styles.currency}>$</span>99</Package.Price>

                        <Package.Description>Adds to any release for premium positioning and maximum impact.</Package.Description>

                        <Package.SummaryList>
                            <Package.SummaryItem>Homepage spotlight (48 hours)</Package.SummaryItem>
                            <Package.SummaryItem>Priority editorial review</Package.SummaryItem>
                            <Package.SummaryItem>Top-of-email distribution</Package.SummaryItem>
                        </Package.SummaryList>

                        <Package.Note>Ideal for major announcements and high-impact campaigns. Select at checkout with any plan.</Package.Note>
                    </Package>

                    <Package className={styles.professionalCampaigns}>
                        <Package.Name>Professional Campaigns</Package.Name>

                        <Package.Price unit="custom quote"><span className={styles.currency}>$</span>999 <span className={styles.currencyPlus}>+</span></Package.Price>

                        <Package.Description>For established brands and agencies running multi-release campaigns.</Package.Description>

                        <Package.SummaryList>
                            <Package.SummaryItem>Multi-release campaign distribution</Package.SummaryItem>
                            <Package.SummaryItem>Custom island & diaspora targeting</Package.SummaryItem>
                            <Package.SummaryItem>Coordinated scheduling</Package.SummaryItem>
                            <Package.SummaryItem>Campaign performance summary</Package.SummaryItem>
                            <Package.SummaryItem>Dedicated support</Package.SummaryItem>
                        </Package.SummaryList>

                        <Button variant="outline-black" size="md" onClick={() => router.push("/contact-us?for=proposal")}>Request a Proposal</Button>
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

Package.Price = function PackagePrice({ children, unit }: React.PropsWithChildren<{ unit?: string }>) {
    return (
        <div className={styles.packagePriceWrap}>
            <h1 className={styles.packagePrice}>{children}</h1>
            {unit && <span className={styles.packagePriceUnit}>{unit}</span>}
        </div>
    );
};

Package.Description = function PackageDescription({ children }: React.PropsWithChildren) {
    return <p className={styles.packageDescription}>{children}</p>;
};

Package.SummaryList = function PackageSummaryList({ children }: React.PropsWithChildren) {
    return <ul className={styles.packageSummaryList}>{children}</ul>;
};

Package.SummaryItem = function PackageSummaryItem({ children }: React.PropsWithChildren) {
    return (
        <li className={styles.summaryItem}>
            <span className={styles.check} aria-hidden="true" />
            {children}
        </li>
    );
};

Package.Note = function PackageNote({ children }: React.PropsWithChildren) {
    return <p className={styles.packageNote}>{children}</p>;
};
