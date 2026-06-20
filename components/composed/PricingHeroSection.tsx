import styles from "./PricingHeroSection.module.scss";

import { Container } from "../layout";

const priceHighlights = [
    { price: "$149", label: "Per release" },
    { price: "$399", label: "3-release pack" },
    { price: "$99", label: "Featured add-on" },
];

const comparisonRows = [
    { feature: "Release credits", single: "1", pack: "3", pro: "Unlimited" },
    { feature: "Editorial review", single: "48h", pack: "48h", pro: "Same day" },
    { feature: "Island targeting", single: "—", pack: "—", pro: "✓" },
    { feature: "Credit validity", single: "Single use", pack: "6 months", pro: "Ongoing" },
    { feature: "Dedicated support", single: "—", pack: "—", pro: "✓" },
];

export default function PricingHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>What you pay</span>

                    <h1>
                        Simple pricing.
                        <span>Regional reach.</span>
                    </h1>

                    <p>
                        No subscriptions. No hidden fees. Choose the distribution option that
                        fits your announcement, campaign, or communications goals.
                    </p>

                    <div className={styles.priceHighlights}>
                        {priceHighlights.map((item) => (
                            <div key={item.label} className={styles.priceHighlight}>
                                <span className={styles.price}>{item.price}</span>
                                <span className={styles.priceLabel}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.comparisonCard}>
                    <span className={styles.comparisonTitle}>Plan comparison at a glance</span>

                    <table className={styles.comparisonTable}>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Single</th>
                                <th className={styles.colPack}>3-Pack</th>
                                <th className={styles.colPro}>Pro</th>
                            </tr>
                        </thead>

                        <tbody>
                            {comparisonRows.map((row) => (
                                <tr key={row.feature}>
                                    <td>{row.feature}</td>
                                    <td>{row.single}</td>
                                    <td className={styles.colPack}>{row.pack}</td>
                                    <td className={styles.colPro}>{row.pro}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </section>
    );
};
