import styles from "./PortalPage.module.scss";

import { Container } from "@/components/layout";

export default function PortalPageSkeleton() {
    return (
        <section className={styles.section} aria-busy="true" aria-label="Loading your portal">
            <Container className={styles.inner}>
                <div className={styles.loadingHero}>
                    <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLineNarrow}`} />
                    <div className={styles.loadingChips}>
                        <div className={`${styles.skeleton} ${styles.skeletonChip}`} />
                        <div className={`${styles.skeleton} ${styles.skeletonChip}`} />
                    </div>
                </div>
                <div className={styles.loadingTabs} aria-hidden>
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`${styles.skeleton} ${styles.skeletonTab}`} />
                    ))}
                </div>
                <div className={styles.panel}>
                    <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonRow} ${styles.skeletonRowShort}`} />
                </div>
            </Container>
        </section>
    );
}
