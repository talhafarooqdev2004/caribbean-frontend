import styles from "./OurMission.module.scss";

import { Container } from "../layout";

export default function OurMission() {
    return (
        <section className={styles.ourMission}>
            <Container className={styles.ourMissionInner}>
                <h1>Our Mission</h1>

                <p>To create a credible, efficient, and region-focused platform that connects Caribbean organizations with the media professionals who matter most.</p>
            </Container>
        </section>
    );
};