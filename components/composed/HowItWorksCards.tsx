import React from "react";
import clsx from "clsx";
import { SvgIcon } from "../ui";
import styles from "./HowItWorksCards.module.scss";

export function HowItWorksCards({ children }: React.PropsWithChildren) {
    return <div className={styles.cards}>{children}</div>;
}

export function HowItWorksCard({ children, type = 'home' }: React.PropsWithChildren<{ type?: "home" | "media-signup" }>) {
    return <div className={clsx(styles.card, type === 'home' ? '' : styles.mediaSignup)}>{children}</div>;
}

HowItWorksCard.Icon = function CardIcon({ icon, className }: { icon: "note-book" | "approve" | "media", className: string }) {
    return (
        <div className={clsx(styles.icon, className)}>
            <SvgIcon icon={icon} />
        </div>
    );
};

HowItWorksCard.Tag = function CardTag({ className, children }: React.PropsWithChildren<{ className: string }>) {
    return <div className={clsx(styles.tag, className)}>{children}</div>
};

HowItWorksCard.Title = function CardTitle({ children }: React.PropsWithChildren) {
    return <h2 className={styles.title}>{children}</h2>;
};

HowItWorksCard.Description = function CardDescription({ children }: React.PropsWithChildren) {
    return <p className={styles.description}>{children}</p>;
};
