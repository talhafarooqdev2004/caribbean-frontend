import styles from "./StartAccessingQualityCaribbeanNewsToday.module.scss";

import { Container } from "../layout";
import { PropsWithChildren } from "react";
import { SvgIcon } from "../ui";
import clsx from "clsx";

export default function StartAccessingQualityCaribbeanNewsToday() {
    return (
        <section className={styles.startAccessing}>
            <Container className={styles.startAccessingInner}>
                <h1>Start Accessing Quality Caribbean News Today</h1>

                <p>Join hundreds of media professionals who trust Carib Newswire for credible, verified press releases from across the Caribbean region.</p>

                <div className={styles.points}>
                    <Point icon="free-for-media" className={styles.freeForMedia}>100% Free for Media</Point>
                    <Point icon="verified-content" className={styles.verifiedContentOnly}>Verified Content Only</Point>
                    <Point icon="regional-focus" className={styles.regionalFocus}>Regional Focus</Point>
                    <Point icon="curated-distribution" className={styles.curatedDistribution}>Curated Distribution</Point>
                </div>
            </Container>
        </section>
    );
};

function Point({ icon, className, children }: PropsWithChildren<{ icon: "free-for-media" | "verified-content" | "regional-focus" | "curated-distribution", className: string }>) {
    return (
        <div className={clsx(styles.point, className)}>
            <SvgIcon icon={icon} />
            <span>{children}</span>
        </div>
    );
};