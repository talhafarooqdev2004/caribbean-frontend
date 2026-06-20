import styles from "./ForMediaWhyJoinCaribNews.module.scss";

import { clsx } from "clsx";
import { Container } from "../layout";
import type { ReactNode } from "react";

type CardItem = {
    num: string;
    icon: ReactNode;
    tone: string;
    title: string;
    description: string;
};

const cards: CardItem[] = [
    {
        num: "01",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_830_799)">
                    <path d="M20.1606 15.5064V18.2558C20.1617 18.5111 20.1094 18.7637 20.0071 18.9975C19.9049 19.2314 19.7549 19.4413 19.5668 19.6139C19.3787 19.7864 19.1567 19.9178 18.9149 19.9996C18.6731 20.0813 18.4169 20.1117 18.1627 20.0887C15.3426 19.7823 12.6337 18.8187 10.2537 17.2752C7.7837 15.7023 5.73807 13.5465 4.29673 10.9975C2.75059 8.61202 1.78683 5.89653 1.4832 3.0701C1.4617 2.81817 1.49256 2.56451 1.57384 2.32507C1.65512 2.08564 1.78506 1.86562 1.95549 1.67883C2.12592 1.49205 2.33315 1.34255 2.56416 1.23973C2.79516 1.13691 3.04494 1.083 3.29779 1.08139H6.04716C6.49192 1.07701 6.92311 1.23451 7.26033 1.52453C7.59756 1.81454 7.81783 2.21729 7.88008 2.6577C7.99647 3.5375 8.21092 4.40172 8.5216 5.23294C8.6449 5.56097 8.67159 5.91746 8.5985 6.26018C8.5254 6.60291 8.3556 6.9175 8.10919 7.16667L7.24772 8.16561C8.54507 10.4327 10.4244 12.312 12.6915 13.6094L13.5621 12.7387C13.8113 12.4923 14.1259 12.3225 14.4686 12.2494C14.8113 12.1763 15.1678 12.203 15.4958 12.3263C16.3271 12.637 17.1913 12.8515 18.0711 12.9679C18.5147 13.0305 18.92 13.2534 19.2104 13.5945C19.5008 13.9356 19.6563 14.3712 19.6474 14.8191L20.1606 15.5064Z" stroke="#FFC400" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_830_799">
                        <rect width="21.995" height="21.995" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        ),
        tone: styles.toneYellow,
        title: "Receive Press Releases",
        description: "Get timely, curated updates from Caribbean organizations — delivered to your inbox, filtered by your beat and region. No noise, no irrelevant pitches.",
    },
    {
        num: "02",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0817 17.4126C14.1308 17.4126 17.4133 14.1301 17.4133 10.0809C17.4133 6.03177 14.1308 2.74927 10.0817 2.74927C6.0325 2.74927 2.75 6.03177 2.75 10.0809C2.75 14.1301 6.0325 17.4126 10.0817 17.4126Z" stroke="#5899E2" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.2444 19.2456L15.2578 15.259" stroke="#5899E2" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        tone: styles.toneBlue,
        title: "Discover Story Opportunities",
        description: "Find newsworthy content, interview leads, and story angles across industries. Our editorial team surfaces the most relevant stories for Caribbean media.",
    },
    {
        num: "03",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4133 2.74927H4.58292C3.57062 2.74927 2.75 3.56989 2.75 4.58218V17.4126C2.75 18.4249 3.57062 19.2455 4.58292 19.2455H17.4133C18.4256 19.2455 19.2463 18.4249 19.2463 17.4126V4.58218C19.2463 3.56989 18.4256 2.74927 17.4133 2.74927Z" stroke="#172940" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.25 2.74927V19.2455" stroke="#172940" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.7461 2.74927V19.2455" stroke="#172940" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.75 8.24805H19.2463" stroke="#172940" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.75 13.7468H19.2463" stroke="#172940" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        tone: styles.toneGray,
        title: "Access News in One Location",
        description: "A centralized platform for all Caribbean press releases — no more hunting across multiple PR wires, inboxes, and government pages. Everything in one place.",
    },
    {
        num: "04",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_830_834)">
                    <path d="M19.2463 9.16463C19.2463 15.5798 10.9981 21.0786 10.9981 21.0786C10.9981 21.0786 2.75 15.5798 2.75 9.16463C2.75 6.97709 3.619 4.87915 5.16582 3.33232C6.71264 1.7855 8.81059 0.916504 10.9981 0.916504C13.1857 0.916504 15.2836 1.7855 16.8304 3.33232C18.3773 4.87915 19.2463 6.97709 19.2463 9.16463Z" stroke="#E8532A" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.9994 11.914C12.5178 11.914 13.7487 10.6831 13.7487 9.16466C13.7487 7.64622 12.5178 6.41528 10.9994 6.41528C9.48094 6.41528 8.25 7.64622 8.25 9.16466C8.25 10.6831 9.48094 11.914 10.9994 11.914Z" stroke="#E8532A" strokeWidth="1.64962" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_830_834">
                        <rect width="21.995" height="21.995" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        ),
        tone: styles.toneRed,
        title: "Stay Informed About the Region",
        description: "Keep up with developments across the Caribbean and diaspora — business, government, culture, technology, and more — across all islands and communities.",
    },
];

export default function ForMediaWhyJoinCaribNews() {
    return (
        <section className={styles.whyJoin}>
            <Container className={styles.whyJoinInner}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}>Why join Carib Newswire?</span>
                    <h2>Work smarter, stay <em>better informed.</em></h2>
                    <p>
                        Carib Newswire helps media professionals work more efficiently by providing a
                        reliable, editorially reviewed source of Caribbean news and announcements —
                        delivered directly to you.
                    </p>
                </header>

                <div className={styles.cards}>
                    {cards.map(({ num, icon, tone, title, description }) => (
                        <article key={num} className={styles.card}>
                            <span className={styles.cardNumber}>{num}</span>

                            <span className={clsx(styles.iconBox, tone)}>
                                {icon}
                            </span>

                            <h3>{title}</h3>
                            <p>{description}</p>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
}
