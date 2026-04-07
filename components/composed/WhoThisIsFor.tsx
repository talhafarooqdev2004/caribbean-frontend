import styles from "./WhoThisIsFor.module.scss";

import { Container } from "../layout";
import React from "react";
import { SvgIcon } from "../ui";

export default function WhoThisIsFor() {
    return (
        <section className={styles.whoThisIsFor}>
            <Container className={styles.whoThisIsForInner}>
                <h1>Who This Is For</h1>

                <p>Carib Newswire is built for verified media professionals across the Caribbean and diaspora, including:</p>

                <Roles>
                    <Role>Journalists</Role>
                    <Role>Editors</Role>
                    <Role>Producers</Role>
                    <Role>Digital media platforms</Role>
                    <Role>Radio and television professionals</Role>
                    <Role>News Organizations</Role>
                </Roles>

                <p>Access is limited to maintain the quality and credibility of the network.</p>
            </Container>
        </section>
    );
};

function Roles({ children }: React.PropsWithChildren) {
    return <div className={styles.roles}>{children}</div>;
};

function Role({ children }: React.PropsWithChildren) {
    return (
        <div className={styles.role}>
            <SvgIcon icon="approve-soft-blue" />
            <span>{children}</span>
        </div>
    );
};