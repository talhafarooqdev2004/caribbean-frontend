import styles from "./ForMediaWhyJoinCaribNews.module.scss";

import { Container } from "../layout";
import { PropsWithChildren } from "react";
import { SvgIcon } from "../ui";

export default function ForMediaWhyJoinCaribNews() {
    return (
        <section className={styles.whyJoin}>
            <Container className={styles.whyJoinInner}>
                <h1>Why Join Carib Newswire</h1>

                <p>Carib Newswire helps media professionals work more efficiently by providing a reliable source of news and information.</p>

                <WhyJoinCards>
                    <WhyJoinCard
                        icon="receive-press"
                        title="Receive press releases and announcements"
                        description="Get timely updates from Caribbean organizations"
                    />

                    <WhyJoinCard
                        icon="discover-story"
                        title="Discover story opportunities"
                        description="Find newsworthy content and interview leads"
                    />

                    <WhyJoinCard
                        icon="access-news"
                        title="Access news in one location"
                        description="Centralized platform for all Caribbean press releases"
                    />

                    <WhyJoinCard
                        icon="stay-informed"
                        title="Stay informed about the region"
                        description="Keep up with developments across the Caribbean and diaspora"
                    />
                </WhyJoinCards>
            </Container>
        </section>
    );
};

function WhyJoinCards({ children }: PropsWithChildren) {
    return <div className={styles.whyJoinCards}>{children}</div>;
};

function WhyJoinCard({ icon, title, description }: { icon: "receive-press" | "discover-story" | "access-news" | "stay-informed", title: string, description: string }) {
    return (
        <div className={styles.whyJoinCard}>
            <div className={styles.iconWrapper}>
                <SvgIcon icon={icon} />
            </div>

            <div>
                <p className={styles.cardTitle}>{title}</p>

                <p className={styles.cardDescription}>{description}</p>
            </div>
        </div>
    );
};