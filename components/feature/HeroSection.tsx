import Image from "next/image";
import { Container } from "../layout";
import styles from "./HeroSection.module.scss";
import { Button, SvgIcon } from "../ui";

export default function HeroSection() {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <div className={styles.detailSection}>
                    <div className={styles.heroSectionBadge}>🌴 Premium Caribbean Press Distribution</div>

                    <h1 className={styles.heroSectionHeading}>
                        Share Your Story.{' '}
                        <span className={styles.prominentText}>Reach Caribbean Media.</span>
                    </h1>

                    <p className={styles.heroSectionDescription}>Carib Newswire is the premium press distribution platform designed for the Caribbean and its global diaspora.</p>

                    <div className={styles.ctaBtns}>
                        <Button className={styles.submitReleaseBtn}>
                            Submit Your Press Release
                            <SvgIcon icon="right-arrow" />
                        </Button>
                        <Button variant="outline">Join as Media</Button>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/hero-section-image-desktop.jpg"
                        alt="Hero Section Image"
                        fill
                        className={styles.heroSectionImage}
                    />
                </div>
            </Container>
        </section>
    );
};