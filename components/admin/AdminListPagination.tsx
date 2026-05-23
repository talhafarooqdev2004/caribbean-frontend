"use client";

import styles from "@/components/admin/AdminEnquiriesPanel.module.scss";
import { Button } from "@/components/ui";

type AdminListPaginationProps = {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
    disabled?: boolean;
    ariaLabel: string;
};

export function AdminListPagination({
    page,
    totalPages,
    onPrevious,
    onNext,
    disabled = false,
    ariaLabel,
}: AdminListPaginationProps) {
    return (
        <nav className={styles.adminPressReleasePagination} aria-label={ariaLabel}>
            <Button type="button" variant="outline" size="md" onClick={onPrevious} disabled={disabled || page <= 1}>
                Previous
            </Button>
            <span className={styles.adminPressReleasePaginationStatus}>
                Page {page} of {Math.max(1, totalPages)}
            </span>
            <Button type="button" variant="outline" size="md" onClick={onNext} disabled={disabled || page >= totalPages}>
                Next
            </Button>
        </nav>
    );
}

export const ADMIN_LIST_PAGE_SIZE = 8;

export type AdminListMeta = {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
};

export function parseAdminListMeta(meta: unknown): Required<Pick<AdminListMeta, "total" | "page" | "totalPages">> {
    const record = meta && typeof meta === "object" ? meta as AdminListMeta : {};
    const total = typeof record.total === "number" ? record.total : 0;
    const page = typeof record.page === "number" ? record.page : 1;
    const totalPages = typeof record.totalPages === "number" ? Math.max(1, record.totalPages) : 1;

    return { total, page, totalPages };
}
