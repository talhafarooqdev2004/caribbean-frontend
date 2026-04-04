import styles from "./LatestNews.module.scss";

import { Container } from "../layout";
import { Button, SvgIcon } from "../ui";
import Image from "next/image";

export default function LatestNews() {
    return (
        <section className={styles.latestNews}>
            <Container className={styles.latestNewsInner}>
                <div className={styles.latestNewsHeader}>
                    <div>
                        <h1 className={styles.heading}>Latest from the Newsroom</h1>
                        <p className={styles.description}>Recent press releases making headlines</p>
                    </div>

                    <Button variant="secondary" className={styles.viewAllBtn}>
                        View All
                        <SvgIcon icon="right-arrow" />
                    </Button>
                </div>

                <NewsList>
                    <News>
                        <News.Header>
                            <News.Image imgSrc="/images/temp/latest-news-1.svg" />
                            <News.Badge>Business</News.Badge>
                        </News.Header>

                        <News.Body>
                            <News.Meta>
                                <News.Territory>Regional</News.Territory>
                                <News.Seprator />
                                <News.Date>March 18, 2026</News.Date>
                            </News.Meta>

                            <News.Title>Major Tourism Initiative Announced for Eastern</News.Title>

                            <News.Description>A new multi-million dollar tourism development project aims to boost visitor numbers across the Eastern Caribbean...</News.Description>
                        </News.Body>
                    </News>

                    <News>
                        <News.Header>
                            <News.Image imgSrc="/images/temp/latest-news-2.svg" />
                            <News.Badge>Technology</News.Badge>
                        </News.Header>

                        <News.Body>
                            <News.Meta>
                                <News.Territory>Jamaica</News.Territory>
                                <News.Seprator />
                                <News.Date>March 17, 2026</News.Date>
                            </News.Meta>

                            <News.Title>Tech Startup Launches AI-Powered Healthcare Platform</News.Title>

                            <News.Description>Innovative healthcare solution aims to improve access to medical services across rural communities...</News.Description>
                        </News.Body>
                    </News>

                    <News>
                        <News.Header>
                            <News.Image imgSrc="/images/temp/latest-news-3.svg" />
                            <News.Badge>Culture</News.Badge>
                        </News.Header>

                        <News.Body>
                            <News.Meta>
                                <News.Territory>Trinidad & Tobago</News.Territory>
                                <News.Seprator />
                                <News.Date>March 15, 2026</News.Date>
                            </News.Meta>

                            <News.Title>Caribbean Festival Celebrates Cultural Heritage</News.Title>

                            <News.Description>Annual cultural festival brings together artists and performers from across the Caribbean region...</News.Description>
                        </News.Body>
                    </News>
                </NewsList>
            </Container>
        </section>
    );
};

function NewsList({ children }: React.PropsWithChildren) {
    return <div className={styles.newsList}>{children}</div>;
};

const News = function ({ children }: React.PropsWithChildren) {
    return <div className={styles.news}>{children}</div>;
};

News.Header = function NewsHeader({ children }: React.PropsWithChildren) {
    return <header className={styles.newsHeader}>{children}</header>;
};

News.Image = function NewsImage({ imgSrc }: { imgSrc: string }) {
    return (
        <Image
            src={imgSrc}
            alt="Latest News Image"
            fill
            className={styles.newsImage}
        />
    );
};

News.Badge = function NewsBadge({ children }: React.PropsWithChildren) {
    return <span className={styles.newsBadge}>{children}</span>;
};

News.Body = function NewsBody({ children }: React.PropsWithChildren) {
    return <div className={styles.newsBody}>{children}</div>;
};

News.Meta = function NewsMeta({ children }: React.PropsWithChildren) {
    return <div className={styles.newsMeta}>{children}</div>;
};

News.Territory = function NewsTerritory({ children }: React.PropsWithChildren) {
    return <span className={styles.newsTerritory}>{children}</span>;
};

News.Seprator = function NewsMetaSeprator() {
    return <SvgIcon icon="seprator" />
};

News.Date = function NewsDate({ children }: React.PropsWithChildren) {
    return <span className={styles.newsDate}>{children}</span>;
};

News.Title = function NewsTitle({ children }: React.PropsWithChildren) {
    return <h2 className={styles.newsTitle}>{children}</h2>;
};

News.Description = function NewsDescription({ children }: React.PropsWithChildren) {
    return <p className={styles.newsDescription}>{children}</p>;
};