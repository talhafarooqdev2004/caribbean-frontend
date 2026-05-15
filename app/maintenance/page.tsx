import Image from "next/image";

import styles from "./maintenance.module.scss";

export const metadata = {
    title: "We will be right back",
    robots: { index: false, follow: false },
};

export default function MaintenancePage() {
    return (
        <div className={styles.wrap}>
            <div className={styles.card}>
                <Image
                    className={styles.logo}
                    src="/images/brand-logo.svg"
                    alt="Carib Newswire"
                    width={200}
                    height={44}
                    priority
                />
                <h1 className={styles.title}>We are carrying out scheduled maintenance</h1>
                <p className={styles.subtitle}>
                    Carib Newswire is temporarily unavailable from your current location. Please try again later, or
                    contact your site administrator if you believe you should have access.
                </p>
                <div className={styles.divider} aria-hidden />
                <p className={styles.note}>
                    Thank you for your patience while we keep the Caribbean newsroom running smoothly.
                </p>
                <p className={styles.brand}>Carib Newswire</p>
            </div>
        </div>
    );
}
