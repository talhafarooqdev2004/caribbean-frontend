type ValidationErrorItem = {
    field?: string;
    message?: string;
};

const FIELD_LABELS: Record<string, string> = {
    fullName: "Full name",
    email: "Email",
    phoneNumber: "Phone",
    organization: "Organization",
    releaseTitle: "Title",
    title: "Title",
    category: "Category",
    island: "Region / island",
    preferredDistributionDate: "Preferred distribution date",
    targetRegions: "Target regions",
    specialInstructions: "Special instructions",
    outboundLink: "Outbound link",
    pressReleaseContent: "Press release content",
    content: "Press release content",
};

export function formatApiValidationErrors(payload: unknown, fallback = "Please fix the highlighted fields."): string {
    if (!payload || typeof payload !== "object") {
        return fallback;
    }

    const record = payload as { message?: unknown; errors?: unknown };
    const errors = record.errors;

    if (!Array.isArray(errors) || errors.length === 0) {
        return typeof record.message === "string" && record.message.trim() && record.message !== "body failed"
            ? record.message
            : fallback;
    }

    const lines = errors
        .map((item) => {
            if (!item || typeof item !== "object") {
                return null;
            }

            const { field, message } = item as ValidationErrorItem;
            const label = typeof field === "string" ? FIELD_LABELS[field] ?? field : "Field";
            const text = typeof message === "string" ? message.trim() : "";

            return text ? `${label}: ${text}` : null;
        })
        .filter(Boolean);

    return lines.length > 0 ? lines.join(" ") : fallback;
}

export function apiValidationErrorsByField(payload: unknown): Record<string, string> {
    if (!payload || typeof payload !== "object" || !Array.isArray((payload as { errors?: unknown }).errors)) {
        return {};
    }

    const out: Record<string, string> = {};

    for (const item of (payload as { errors: ValidationErrorItem[] }).errors) {
        if (!item?.field || !item.message) {
            continue;
        }

        out[item.field] = item.message;
    }

    return out;
}

/** Maps API / Zod field names to admin create form keys. */
export const ADMIN_CREATE_FIELD_FROM_API: Record<string, string> = {
    fullName: "fullName",
    email: "email",
    phoneNumber: "phoneNumber",
    organization: "organization",
    releaseTitle: "title",
    category: "category",
    island: "island",
    preferredDistributionDate: "preferredDistributionDate",
    targetRegions: "targetRegions",
    specialInstructions: "specialInstructions",
    outboundLink: "outboundLink",
    pressReleaseContent: "content",
};
