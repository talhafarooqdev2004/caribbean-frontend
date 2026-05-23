import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const authHeader = await getAdminAuthorizationHeader();
    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = request.nextUrl.searchParams.get("page") ?? "1";
    const limit = request.nextUrl.searchParams.get("limit") ?? "8";
    const contactOnly = request.nextUrl.searchParams.get("contactOnly") === "1" ? "1" : "0";
    const response = await caribApiFetch(
        `/admin/contact-messages?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&contactOnly=${contactOnly}`,
        { headers: authHeader },
    );
    const payload = await parseCaribApiJson(response);

    return Response.json(
        {
            contactMessages: Array.isArray(payload?.data) ? payload.data : [],
            meta: payload?.meta ?? null,
            message: typeof payload?.message === "string" ? payload.message : undefined,
        },
        { status: response.status },
    );
}
