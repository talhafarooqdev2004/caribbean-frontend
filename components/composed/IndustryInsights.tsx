import styles from "./IndustryInsights.module.scss";

import { Container } from "../layout";

export default function IndustryInsights() {
    return (
        <section className={styles.industryInsights}>
            <Container className={styles.industryInsightsInner}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}>What people are saying</span>
                    <h2>
                        Industry <em>Insights.</em>
                    </h2>
                </header>

                <figure className={styles.quoteFigure}>
                    <blockquote className={styles.quoteBlock}>
                        <span className={styles.quoteMark} aria-hidden="true">
                            <svg width="38" height="96" viewBox="0 0 38 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.85">
                                    <path d="M12.48 37.3356C10.56 37.3356 9.056 36.6316 7.968 35.2236C6.88 33.8156 6.336 32.0236 6.336 29.8476C6.336 28.2476 6.624 26.3276 7.2 24.0876C7.776 21.8476 8.64 19.5756 9.792 17.2716C11.008 14.9036 12.48 12.7276 14.208 10.7436L16.608 12.6636C15.52 13.9436 14.56 15.4476 13.728 17.1756C12.96 18.9036 12.352 20.6956 11.904 22.5516C11.456 24.4076 11.232 26.1996 11.232 27.9276C11.552 27.7996 11.904 27.7036 12.288 27.6396C12.736 27.5756 13.184 27.5436 13.632 27.5436C14.848 27.5436 15.84 27.9916 16.608 28.8876C17.44 29.7836 17.856 30.8076 17.856 31.9596C17.856 33.6876 17.312 35.0316 16.224 35.9916C15.2 36.8876 13.952 37.3356 12.48 37.3356ZM29.376 37.3356C27.456 37.3356 25.952 36.6316 24.864 35.2236C23.776 33.8156 23.232 32.0236 23.232 29.8476C23.232 28.2476 23.52 26.3276 24.096 24.0876C24.672 21.8476 25.536 19.5756 26.688 17.2716C27.904 14.9036 29.376 12.7276 31.104 10.7436L33.504 12.6636C32.416 13.9436 31.456 15.4476 30.624 17.1756C29.856 18.9036 29.248 20.6956 28.8 22.5516C28.352 24.4076 28.128 26.1996 28.128 27.9276C28.448 27.7996 28.8 27.7036 29.184 27.6396C29.632 27.5756 30.08 27.5436 30.528 27.5436C31.744 27.5436 32.736 27.9916 33.504 28.8876C34.336 29.7836 34.752 30.8076 34.752 31.9596C34.752 33.6876 34.208 35.0316 33.12 35.9916C32.096 36.8876 30.848 37.3356 29.376 37.3356Z" fill="#F4C430" />
                                </g>
                            </svg>
                        </span>
                        <p className={styles.quote}>
                            Carib Newswire fills a critical gap in the region&apos;s media landscape. By giving
                            journalists timely, verified information from across the Caribbean, it strengthens our
                            ability to report with accuracy and depth. A platform like this supports better journalism
                            and a better-informed public.
                        </p>
                    </blockquote>

                    <figcaption className={styles.attribution}>
                        <span className={styles.avatar}>CT</span>
                        <div className={styles.attributionCopy}>
                            <cite className={styles.authorName}>Clint Chan Tack</cite>
                            <span className={styles.authorRole}>
                                27 years in Caribbean media Former Senior Journalist, Trinidad and Tobago Newsday
                            </span>
                        </div>
                    </figcaption>
                </figure>
            </Container>
        </section>
    );
}
