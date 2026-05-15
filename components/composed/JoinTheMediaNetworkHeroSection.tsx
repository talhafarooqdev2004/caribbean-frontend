import styles from "./JoinTheMediaNetworkHeroSection.module.scss";

import { Container } from "../layout";

export default function JoinTheMediaNetworkHeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <div className={styles.heroSectionBadge}>📰 For Media Professionals</div>

                <h1>Join the Media Network</h1>

                <p>Carib Newswire connects journalists and media professionals across the Caribbean and diaspora with credible news, verified information, and story opportunities.</p>
            </Container>
        </section>
    );
};