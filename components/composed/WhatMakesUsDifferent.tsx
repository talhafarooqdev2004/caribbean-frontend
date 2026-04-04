import styles from "./WhatMakesUsDifferent.module.scss";

import { Container } from "../layout";
import { SvgIcon } from "../ui";

export default function WhatMakesUsDifferent() {
    return (
        <section className={styles.whatMakesUsDifferent}>
            <Container className={styles.whatMakesUsDifferentInner}>
                <h1>What Makes Us Different</h1>

                <p>Unlike global distribution platforms that treat the Caribbean as an afterthought, we are purpose-built for this region.</p>

                <Cards>
                    <Card
                        icon="approve"
                        label="Verified submissions"
                    />

                    <Card
                        icon="target"
                        label="Targeted island and category alignment"
                    />

                    <Card
                        icon="peoples"
                        label="Curated journalist networks"
                    />

                    <Card
                        icon="compaign-based-distribution"
                        label="Campaign-based distribution"
                    />
                </Cards>
            </Container>
        </section>
    );
};

function Cards({ children }: React.PropsWithChildren) {
    return <div className={styles.cards}>{children}</div>;
};

function Card({ icon, label }: { icon: "approve" | "target" | "peoples" | "compaign-based-distribution", label: string }) {
    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper}>
                <SvgIcon icon={icon} />
            </div>

            <span>{label}</span>
        </div>
    );
};