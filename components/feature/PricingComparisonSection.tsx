import styles from "./PricingComparisonSection.module.scss";

import { Fragment } from "react";
import { Container } from "../layout";
import { SvgIcon } from "../ui";
import { clsx } from "clsx";

type CellValue = string | boolean;

type ComparisonRow = {
    feature: string;
    sub?: string;
    single: CellValue;
    pack: CellValue;
    pro: CellValue;
};

type ComparisonGroup = {
    title: string;
    rows: ComparisonRow[];
};

const groups: ComparisonGroup[] = [
    {
        title: "Distribution",
        rows: [
            { feature: "Release credits included", sub: "Number of press releases covered by the option", single: "1", pack: "3", pro: "Unlimited" },
            { feature: "Caribbean-wide distribution", single: true, pack: true, pro: true },
            { feature: "Island targeting", sub: "Send to specific islands and territories", single: false, pack: false, pro: true },
            { feature: "Diaspora distribution", sub: "US, UK & Canada Caribbean media", single: false, pack: false, pro: true },
            { feature: "Credit validity", single: "Single use", pack: "6 months", pro: "Ongoing" },
        ],
    },
    {
        title: "Content & Editorial",
        rows: [
            { feature: "Word limit", single: "700 words", pack: "700 words", pro: "Unlimited" },
            { feature: "Images included", single: "Up to 2", pack: "Up to 2", pro: "Up to 5" },
            { feature: "Outbound links", single: "1 link", pack: "1 link", pro: "Unlimited" },
            { feature: "Editorial review turnaround", single: "48 hours", pack: "48 hours", pro: "Same day" },
            { feature: "Newsroom publication", single: true, pack: true, pro: true },
        ],
    },
    {
        title: "Analytics & Reporting",
        rows: [
            { feature: "Basic distribution report", single: true, pack: true, pro: true },
            { feature: "Campaign performance summary", single: false, pack: false, pro: true },
            { feature: "Full media monitoring", single: false, pack: false, pro: true },
        ],
    },
    {
        title: "Support",
        rows: [
            { feature: "Email support", single: true, pack: true, pro: true },
            { feature: "Dedicated account manager", single: false, pack: false, pro: true },
            { feature: "Coordinated scheduling", single: false, pack: false, pro: true },
        ],
    },
];

function Cell({ value }: { value: CellValue }) {
    if (value === true) return <SvgIcon icon="soft-blue-tick" />;
    if (value === false) return <span className={styles.dash}>—</span>;
    return <>{value}</>;
}

export default function PricingComparisonSection() {
    return (
        <section className={styles.comparisonSection}>
            <Container className={styles.comparisonContainer}>
                <header className={styles.sectionHeader}>
                    <span className={styles.eyebrow}>Full comparison</span>
                    <h2>Everything in detail</h2>
                </header>

                <div className={styles.tableScroll}>
                    <table className={styles.comparisonTable}>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>
                                    <span className={styles.headerShort}>Single</span>
                                    <span className={styles.headerFull}>Single Release</span>
                                </th>
                                <th className={styles.colHighlight}>
                                    <span className={styles.headerShort}>3-Pack</span>
                                    <span className={styles.headerFull}>3-Release Pack</span>
                                </th>
                                <th>
                                    <span className={styles.headerShort}>Pro</span>
                                    <span className={styles.headerFull}>Professional</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {groups.map((group) => (
                                <Fragment key={group.title}>
                                    <tr className={styles.groupRow}>
                                        <td colSpan={4}>{group.title}</td>
                                    </tr>

                                    {group.rows.map((row) => (
                                        <tr key={row.feature}>
                                            <td className={styles.featureCell}>
                                                <span className={styles.featureName}>{row.feature}</span>
                                                {row.sub && <span className={styles.featureSub}>{row.sub}</span>}
                                            </td>
                                            <td className={styles.valueCell}><Cell value={row.single} /></td>
                                            <td className={clsx(styles.valueCell, styles.colHighlight)}><Cell value={row.pack} /></td>
                                            <td className={styles.valueCell}><Cell value={row.pro} /></td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.note}>
                    <span className={styles.iconBox}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.9939 1.16595L8.79531 4.81543L12.8237 5.40424L9.90881 8.24337L10.5967 12.2543L6.9939 10.3596L3.39106 12.2543L4.07898 8.24337L1.16406 5.40424L5.19248 4.81543L6.9939 1.16595Z" fill="#C4922A" />
                        </svg>
                    </span>
                    <p>
                        <strong>Featured Placement (+$99)</strong> — available as an add-on with any option. Includes homepage spotlight and top-of-email positioning. Select it at checkout.
                    </p>
                </div>
            </Container>
        </section>
    );
};
