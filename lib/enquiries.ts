import "server-only";

import { caribApiFetch, parseCaribApiJson } from "./backend-api";
import { getAdminAuthorizationHeader } from "./admin-auth";
import { validateEnquiryInput, type EnquiryErrors } from "./enquiry-validation";
import { type EnquiryFormValues, type EnquirySubmissionValues } from "./enquiry-options";
import {
    type EnquiryRecord,
    type EnquiryStatus,
} from "./enquiry-types";

export async function insertEnquiry(input: EnquirySubmissionValues) {
    const response = await caribApiFetch("/media-signups", {
        method: "POST",
        body: JSON.stringify(input),
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        throw new Error(typeof payload?.message === "string" ? payload.message : "Unable to persist enquiry.");
    }

    return payload?.data as EnquiryRecord;
}

export async function listEnquiries() {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const response = await caribApiFetch("/admin/media-signups", {
        headers: authHeader,
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        throw new Error(typeof payload?.message === "string" ? payload.message : "Unable to load enquiries.");
    }

    return (Array.isArray(payload?.data) ? payload.data : []) as EnquiryRecord[];
}

export async function deleteEnquiryById(id: string) {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return {
            deleted: false,
            invalidId: false,
        } as const;
    }

    const response = await caribApiFetch(`/admin/media-signups/${id}`, {
        method: "DELETE",
        headers: authHeader,
    });

    return {
        deleted: response.ok,
        invalidId: response.status === 400,
    } as const;
}

export async function setEnquiryStatusById(id: string, status: EnquiryStatus) {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return {
            updated: false,
            invalidId: false,
            notFound: false,
            enquiry: null,
        } as const;
    }

    const response = await caribApiFetch(`/admin/media-signups/${id}/status`, {
        method: "PATCH",
        headers: authHeader,
        body: JSON.stringify({
            status,
        }),
    });
    const payload = await parseCaribApiJson(response);

    if (response.status === 400) {
        return {
            updated: false,
            invalidId: true,
            notFound: false,
            enquiry: null,
        } as const;
    }

    if (response.status === 404) {
        return {
            updated: false,
            invalidId: false,
            notFound: true,
            enquiry: null,
        } as const;
    }

    if (!response.ok) {
        return {
            updated: false,
            invalidId: false,
            notFound: false,
            enquiry: null,
        } as const;
    }

    return {
        updated: true,
        invalidId: false,
        notFound: false,
        enquiry: payload?.data as EnquiryRecord,
    } as const;
}

export async function approveEnquiryById(id: string) {
    return setEnquiryStatusById(id, "approved");
}

export async function rejectEnquiryById(id: string) {
    return setEnquiryStatusById(id, "rejected");
}

export async function revertEnquiryById(id: string) {
    return setEnquiryStatusById(id, "pending");
}

export function validateAndInsertableEnquiry(input: Partial<EnquiryFormValues>) {
    return validateEnquiryInput(input);
}

export type { EnquiryErrors };
export type { EnquirySubmissionValues };
