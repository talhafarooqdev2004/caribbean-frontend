import styles from "./WhyJoinTheNetwork.module.scss";

import { Container } from "../layout";
import React from "react";
import clsx from "clsx";
import { SvgIcon } from "../ui";

export default function WhyJoinTheNetwork() {
    return (
        <section className={styles.whyJoinTheNetwork}>
            <Container className={styles.whyJoinTheNetworkInner}>
                <h1>Why Join the Network</h1>

                <ReasonCards>
                    <ReasonCard
                        icon="up-arrow"
                        iconClass={styles.iconCard1}
                        label="Priority Access"
                        description="Be among the first to receive verified press releases and story opportunities from across the Caribbean."
                    />

                    <ReasonCard
                        icon="relevant-curated-content"
                        iconClass={styles.iconCard2}
                        label="Relevant, Curated Content"
                        description="No spam. Only stories aligned with your beat, region, and interests."
                    />

                    <ReasonCard
                        icon="map"
                        iconClass={styles.iconCard3}
                        label="Media Visibility"
                        description="Be discoverable to organizations looking to connect with credible Caribbean journalists."
                    />

                    <ReasonCard
                        icon="free-to-join"
                        iconClass={styles.iconCard4}
                        label="Free to Join"
                        description="Always free for verified media professionals."
                    />
                </ReasonCards>
            </Container>
        </section>
    );
};

function ReasonCards({ children }: React.PropsWithChildren) {
    return <div className={styles.reasonCards}>{children}</div>;
}

function ReasonCard({
    icon,
    iconClass,
    label,
    description
}: {
    icon: "up-arrow" | "relevant-curated-content" | "map" | "free-to-join",
    iconClass: string,
    label: string,
    description: string
}) {
    return (
        <div className={styles.reasonCard}>
            <div className={clsx(styles.cardIconWrapper, iconClass)}>
                <SvgIcon icon={icon} />
            </div>

            <span>{label}</span>

            <p>{description}</p>
        </div>
    );
};