"use client";

import styles from "./NewsRoomFilter.module.scss";

import clsx from "clsx";
import { type KeyboardEvent } from "react";
import { Input, SvgIcon } from "../ui";

type NewsRoomFilterProps = {
    activeCategory?: string;
    categories?: string[];
    className?: string;
    searchValue?: string;
    onCategoryChange?: (category: string) => void;
    onSearchChange?: (value: string) => void;
    onFilterApply?: () => void;
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

export default function NewsRoomFilter({
    activeCategory = "All Categories",
    categories = defaultCategories,
    className,
    searchValue = "",
    onCategoryChange,
    onSearchChange,
    onFilterApply,
}: NewsRoomFilterProps) {
    function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            onFilterApply?.();
        }
    }

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
                        onKeyDown={handleSearchKeyDown}
                        autoComplete="off"
                    />
                </div>

                <button
                    type="button"
                    className={styles.filterToggle}
                    onClick={() => onFilterApply?.()}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.66797 3.99976H13.3338" stroke="#FFC400" strokeWidth="1.33323" strokeLinecap="round" />
                        <path d="M5.33203 7.99951H10.665" stroke="#FFC400" strokeWidth="1.33323" strokeLinecap="round" />
                        <path d="M7.33203 11.999H8.66526" stroke="#FFC400" strokeWidth="1.33323" strokeLinecap="round" />
                    </svg>

                    Filter
                </button>
            </div>

            <div className={styles.tabs}>
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={clsx(styles.tab, category === activeCategory && styles.tabActive)}
                        onClick={() => onCategoryChange?.(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}
