import styles from "./NewsRoomHeroSection.module.scss";

import { Container } from "../layout";
import NewsRoomFilter from "./NewsRoomFilter";

type NewsRoomHeroSectionProps = {
    activeCategory?: string;
    categories?: string[];
    searchValue?: string;
    onCategoryChange?: (category: string) => void;
    onSearchChange?: (value: string) => void;
    onFilterApply?: () => void;
};

export default function NewsRoomHeroSection({
    activeCategory,
    categories,
    searchValue,
    onCategoryChange,
    onSearchChange,
    onFilterApply,
}: NewsRoomHeroSectionProps) {
    return (
        <section className={styles.heroSection}>
            <Container className={styles.heroSectionInner}>
                <span className={styles.badge}>Caribbean Press</span>

                <h1>Newsroom</h1>

                <p>The latest press releases and announcements from across the Caribbean</p>

                <NewsRoomFilter
                    activeCategory={activeCategory}
                    categories={categories}
                    className={styles.heroSectionFilter}
                    searchValue={searchValue}
                    onCategoryChange={onCategoryChange}
                    onSearchChange={onSearchChange}
                    onFilterApply={onFilterApply}
                />
            </Container>
        </section>
    );
}
