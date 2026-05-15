import styles from "./NewsRoomFilter.module.scss";

import clsx from "clsx";
import { Button, Input, SvgIcon } from "../ui";

type NewsRoomFilterProps = {
    activeCategory?: string;
    categories?: string[];
    className?: string;
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

const defaultCategories = [
    "All Categories",
    "Business",
    "Culture",
    "Education",
    "Environment",
    "Government",
    "Healthcare",
    "Technology",
    "Tourism",
];

const islands = ["All Islands", "USVI", "Jamaica", "Trinidad", "Barbados", "Grenada", "Antigua", "All Caribbean"];
const dateRanges = [
    ["allTime", "All Time"],
    ["today", "Today"],
    ["thisWeek", "This Week"],
    ["thisMonth", "This Month"],
    ["last3Months", "Last 3 Months"],
] as const;
const sortOptions = [
    ["newest", "Newest First"],
    ["oldest", "Oldest First"],
    ["mostViewed", "Most Viewed"],
    ["featuredFirst", "Featured First"],
] as const;

export default function NewsRoomFilter({
    activeCategory = "All Categories",
    categories = defaultCategories,
    className,
    searchValue = "",
    activeIsland = "All Islands",
    dateRange = "allTime",
    sort = "newest",
    onCategoryChange,
    onIslandChange,
    onDateRangeChange,
    onSortChange,
    onSearchChange,
}: NewsRoomFilterProps) {
    return (
        <div className={clsx(styles.filter, className)}>
            <div className={styles.filterActionWrapper}>
                <div className={styles.searchInputWrapper}>
                    <div className={styles.searchIconWrapper}>
                        <SvgIcon icon="search" />
                    </div>
                    <Input
                        type="search"
                        placeholder="Search press releases..."
                        value={searchValue}
                        onChange={(event) => onSearchChange?.(event.target.value)}
                        autoComplete="off"
                    />
                </div>
                <select className={styles.filterSelect} value={dateRange} onChange={(event) => onDateRangeChange?.(event.target.value)} aria-label="Date filter">
                    {dateRanges.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select className={styles.filterSelect} value={sort} onChange={(event) => onSortChange?.(event.target.value)} aria-label="Sort releases">
                    {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
            </div>

            <Categories>
                {categories.map((category) => (
                    <Category
                        key={category}
                        active={category === activeCategory}
                        onClick={() => onCategoryChange?.(category)}
                    >
                        {category}
                    </Category>
                ))}
            </Categories>

            <Categories>
                {islands.map((island) => (
                    <Category
                        key={island}
                        active={island === activeIsland}
                        onClick={() => onIslandChange?.(island)}
                    >
                        {island}
                    </Category>
                ))}
            </Categories>
        </div>
    );
};

function Categories({ children }: React.PropsWithChildren) {
    return <div className={styles.categories}>{children}</div>;
};

function Category({
    active = false,
    children,
    onClick,
}: React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>) {
    return (
        <Button
            className={clsx(styles.category, active && styles.categoryActive)}
            variant="newsroom-category"
            onClick={onClick}
            type="button"
        >
            {children}
        </Button>
    );
};
