import styles from "./NewsRoomHeroSection.module.scss";

import { Container } from "../layout";
import NewsRoomFilter from "./NewsRoomFilter";

type NewsRoomHeroSectionProps = {
    activeCategory?: string;
    categories?: string[];
    searchValue?: string;
    activeIsland?: string;
    dateRange?: string;
    sort?: string;
    onCategoryChange?: (category: string) => void;
    onIslandChange?: (island: string) => void;
    onDateRangeChange?: (dateRange: string) => void;
    onSortChange?: (sort: string) => void;
    onSearchChange?: (value: string) => void;
};

export default function NewsRoomHeroSection({
    activeCategory,
    categories,
    searchValue,
    activeIsland,
    dateRange,
    sort,
    onCategoryChange,
    onIslandChange,
    onDateRangeChange,
    onSortChange,
    onSearchChange,
}: NewsRoomHeroSectionProps) {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <h1>Newsroom</h1>

                <p>The latest press releases and announcements from across the Caribbean</p>

                <NewsRoomFilter
                    activeCategory={activeCategory}
                    categories={categories}
                    className={styles.heroSectionFilter}
                    searchValue={searchValue}
                    activeIsland={activeIsland}
                    dateRange={dateRange}
                    sort={sort}
                    onCategoryChange={onCategoryChange}
                    onIslandChange={onIslandChange}
                    onDateRangeChange={onDateRangeChange}
                    onSortChange={onSortChange}
                    onSearchChange={onSearchChange}
                />
            </Container>
        </section>
    );
};
