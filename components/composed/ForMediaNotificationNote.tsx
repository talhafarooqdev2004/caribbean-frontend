import styles from "./ForMediaNotificationNote.module.scss";

import { Container } from "../layout";

export default function ForMediaNotificationNote() {
    return (
        <section className={styles.notificationNote}>
            <Container className={styles.notificationNoteInner}>
                <div className={styles.note}>If you report on Caribbean issues or Caribbean people, <span className={styles.prominentLine}>Carib Newswire is built for you.</span></div>
            </Container>
        </section>
    );
}