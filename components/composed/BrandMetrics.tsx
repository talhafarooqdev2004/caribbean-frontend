import styles from "./BrandMetrics.module.scss";

import { Container } from "../layout";

export default function BrandMetrics() {
    return (
        <section className={styles.brandMetrics}>
            <Container className={styles.brandMetricsInner}>
                <Metric>
                    <Metric.Count>500+</Metric.Count>
                    <Metric.Label>Media Professionals</Metric.Label>
                </Metric>
                <Metric>
                    <Metric.Count>1,200+</Metric.Count>
                    <Metric.Label>Press Releases</Metric.Label>
                </Metric>
                <Metric>
                    <Metric.Count>15+</Metric.Count>
                    <Metric.Label>Caribbean Islands</Metric.Label>
                </Metric>
                <Metric>
                    <Metric.Count>98%</Metric.Count>
                    <Metric.Label>Distribution Rate</Metric.Label>
                </Metric>
            </Container>
        </section>
    );
};

const Metric = ({ children }: React.PropsWithChildren) => {
    return <div className={styles.metric}>{children}</div>;
};

Metric.Count = function MetricCount({ children }: React.PropsWithChildren) {
    return <span className={styles.metricCount}>{children}</span>;
};

Metric.Label = function MerticLabel({ children }: React.PropsWithChildren) {
    return <span className={styles.metricLabel}>{children}</span>;
};