import styles from "./NotificationNote.module.scss";

import { Container } from "../layout";

export default function NotificationNote() {
    return (
        <section className={styles.notificationNote}>
            <Container className={styles.notificationNoteInner}>
                <div className={styles.note}>We are not a mass email service. We are building a <span className={styles.prominentLine}>trusted distribution layer</span> for Caribbean news.</div>
            </Container>
        </section>
    );
};