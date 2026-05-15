export type ContactMessageEntrySource = "general" | "pricing_proposal";

export type ContactMessageAdminRecord = {
    id: string;
    name: string;
    email: string;
    organization: string;
    inquiryType: string;
    message: string;
    entrySource: ContactMessageEntrySource;
    promotedMediaSignupId: string | null;
    portalInviteComplete: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
};
