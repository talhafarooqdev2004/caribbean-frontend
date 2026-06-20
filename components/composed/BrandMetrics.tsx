import styles from "./BrandMetrics.module.scss";

import { clsx } from "clsx";
import { Clock, Globe, Send, Users, type LucideIcon } from "lucide-react";

type MetricItem = {
    icon: LucideIcon;
    title: string;
    suffix?: string;
    suffixVariant?: "plus" | "accent";
    label: string;
};

const metrics: MetricItem[] = [
    { icon: Users, title: "Growing", label: "Media Network" },
    { icon: Globe, title: "15", suffix: "+", suffixVariant: "plus", label: "Caribbean Markets" },
    { icon: Clock, title: "48", suffix: "hr", suffixVariant: "accent", label: "Editorial Turnaround" },
    { icon: Send, title: "Targeted", label: "Distribution" },
];

export default function BrandMetrics() {
    return (
        <section className={styles.brandMetrics}>
            <div className={styles.brandMetricsInner}>
                {metrics.map((metric) => {
                    const Icon = metric.icon;

                    return (
                        <div key={metric.label} className={styles.metric}>
                            <Icon className={styles.metricIcon} size={26} strokeWidth={1.75} />
                            <h3 className={styles.metricTitle}>
                                {metric.title}
                                {metric.suffix ? (
                                    <span
                                        className={clsx(
                                            styles.metricSuffix,
                                            metric.suffixVariant === "plus" && styles.metricSuffixPlus,
                                            metric.suffixVariant === "accent" && styles.metricSuffixAccent,
                                        )}
                                    >
                                        {metric.suffix}
                                    </span>
                                ) : null}
                            </h3>
                            <p className={styles.metricLabel}>{metric.label}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
