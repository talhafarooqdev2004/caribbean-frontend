import styles from "./BuiltForTheCaribbean.module.scss";

import { Container } from "../layout";
import Image from "next/image";
import { SvgIcon } from "../ui";

export default function BuiltForTheCaribbean() {
    return (
        <section className={styles.builtForTheCaribbean}>
            <Container className={styles.builtForTheCaribbeanInner}>
                <div className={styles.detailSection}>
                    <h1>Built for the Caribbean</h1>

                    <p>Carib Newswire is designed specifically for the Caribbean and its global diaspora, with a deep understanding of how media operates across our region.</p>

                    <p>We&apos;re building a platform that connects journalists with credible, relevant stories—making it easier to discover, cover, and share what matters.</p>

                    <div className={styles.contactus}>
                        <SvgIcon icon="contact-us" />
                        <div className={styles.contactusDetails}>
                            <span>Contact us</span>

                            <a href="mailto:info@caribnewswire.com">
                                <span>info@caribnewswire.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/Built-for-the-caribbean.jpg"
                        alt="Built For The Caribbean Image"
                        fill
                        className={styles.image}
                    />
                </div>
            </Container>
        </section>
    );
};