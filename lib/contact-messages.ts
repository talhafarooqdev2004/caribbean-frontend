import "server-only";

import { caribApiFetch, parseCaribApiJson } from "./backend-api";
import { getAdminAuthorizationHeader } from "./admin-auth";
import type { ContactMessageAdminRecord } from "./contact-message-types";

export async function listContactMessagesForAdmin(): Promise<ContactMessageAdminRecord[]> {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const response = await caribApiFetch("/admin/contact-messages", {
        headers: authHeader,
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        throw new Error(typeof payload?.message === "string" ? payload.message : "Unable to load contact messages.");
    }

    return (Array.isArray(payload?.data) ? payload.data : []) as ContactMessageAdminRecord[];
}
