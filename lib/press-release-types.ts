export type PressReleaseRecord = {
    id: string;
    submitterId?: string | null;
    fullName: string;
    email: string;
    phoneNumber: string;
    organization: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: string;
    island: string;
    preferredDistributionDate: string;
    targetRegions: string;
    specialInstructions: string;
    /** Optional http(s) URL shown on the published newsroom detail page. */
    outboundLink?: string;
    coverImagePath: string | null;
    documentPath: string | null;
    packageId: "single" | "bundle" | "custom";
    featuredUpgrade: boolean;
    amountCents: number;
    featured: boolean;
    /** Higher values appear first in the featured carousel. */
    featuredPriority: number;
    featuredUntil?: string | null;
    isActive?: boolean;
    rejectionReason: string | null;
    status: string;
    paymentStatus: string;
    paymentId?: string | null;
    views: number;
    clicks: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    /** Estimated read time in minutes (from API when available). */
    readingMinutes?: number;
};
