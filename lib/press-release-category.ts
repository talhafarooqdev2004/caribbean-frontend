export function getPressReleaseCategorySlug(category: string | null | undefined): string {
    if (!category?.trim()) {
        return "news";
    }

    const slug = category.trim().toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-+|-+$/g, "");

    return slug || "news";
}
