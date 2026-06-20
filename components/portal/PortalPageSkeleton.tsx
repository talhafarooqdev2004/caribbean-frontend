import styles from "./PortalPage.module.scss";

import { Container } from "@/components/layout";

export default function PortalPageSkeleton() {
    return (
        <div className={styles.portalPage} aria-busy="true" aria-label="Loading your portal">
            <section className={styles.portalHero}>
                <Container className={styles.portalHeroInner}>
                    <div className={styles.loadingHero}>
                        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                        <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
                        <div className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLineNarrow}`} />
                        <div className={styles.loadingChips}>
                            <div className={`${styles.skeleton} ${styles.skeletonChip}`} />
                            <div className={`${styles.skeleton} ${styles.skeletonChip}`} />
                        </div>
                    </div>
                </Container>
            </section>

            <div className={styles.curve} aria-hidden="true">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z" />
                </svg>
            </div>

            <Container className={styles.portalBody}>
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
        </div>
    );
}
