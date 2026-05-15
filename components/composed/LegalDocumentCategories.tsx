"use client";

import styles from "./LegalDocumentCategories.module.scss";

import type { LucideIcon } from "lucide-react";

import { Container } from "../layout";
import { smoothScrollToElement } from "@/utils/scroll";

export type LegalDocumentCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type LegalDocumentCategoriesProps = {
  categories: LegalDocumentCategory[];
};

export default function LegalDocumentCategories({
  categories,
}: LegalDocumentCategoriesProps) {
  return (
    <section className={styles.legalCategories}>
      <Container className={styles.legalCategoriesInner}>
        <div className={styles.pillList}>
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                className={styles.pill}
                type="button"
                onClick={() => smoothScrollToElement(category.id, 112)}
              >
                <Icon size={15} strokeWidth={1.8} />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
