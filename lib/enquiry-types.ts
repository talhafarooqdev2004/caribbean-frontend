import type { EnquirySubmissionValues } from "./enquiry-options";

export const ENQUIRY_STATUSES = ["pending", "approved", "rejected"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export type StoredEnquiryStatus = EnquiryStatus | "new";

export type StoredEnquiry = EnquirySubmissionValues & {
    source: "media-signup";
    status: StoredEnquiryStatus;
    createdAt: Date;
    updatedAt: Date;
};

export type EnquiryRecord = Omit<StoredEnquiry, "_id" | "createdAt" | "updatedAt"> & {
    status: EnquiryStatus;
    id: string;
    createdAt: string;
    updatedAt: string;
};
