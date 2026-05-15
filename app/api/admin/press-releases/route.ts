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
    const status = request.nextUrl.searchParams.get("status");
    const statusQuery =
        status === "pending" || status === "approved" || status === "rejected"
            ? `&status=${encodeURIComponent(status)}`
            : "";

    const response = await caribApiFetch(`/press-releases/admin/all/list?sort=adminQueue&limit=${encodeURIComponent(limit)}&page=${encodeURIComponent(page)}&paymentStatus=paid${statusQuery}`, {
        headers: authHeader,
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json(
            { error: typeof payload?.message === "string" ? payload.message : "Unable to load press releases." },
            { status: response.status }
        );
    }

    const meta = payload?.meta && typeof payload.meta === "object" ? payload.meta : null;

    return Response.json({
        message: payload?.message,
        releases: Array.isArray(payload?.data) ? payload.data : [],
        meta,
    });
}
