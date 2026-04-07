"use client";

import styles from "./JoinTheCaribbeanMediaNetwork.module.scss";

import { Container } from "../layout";
import { Button, SvgIcon } from "../ui";
import { smoothScrollToElement } from "@/utils/scroll";

export default function JoinTheCaribbeanMediaNetwork() {
    return (
        <section className={styles.joinTheCaribbeanMediaNetwork}>
            <Container className={styles.joinTheCaribbeanMediaNetworkInner}>
                <h1>Join the Caribbean Media Network</h1>

                <p>Limited early access available for verified journalists and media professionals.</p>

                <Button onClick={() => smoothScrollToElement("apply-for-early-access")}>
                    <SvgIcon icon="rocket" />
                    Apply Now
                </Button>
            </Container>
        </section>
    );
};