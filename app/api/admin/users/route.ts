import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const authHeader = await getAdminAuthorizationHeader();
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const page = request.nextUrl.searchParams.get("page") ?? "1";
    const limit = request.nextUrl.searchParams.get("limit") ?? "8";
    const search = request.nextUrl.searchParams.get("search") ?? "";
    const response = await caribApiFetch(
        `/admin/users?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search)}`,
        { headers: authHeader },
    );
    const payload = await parseCaribApiJson(response);

    return Response.json(
        {
            users: Array.isArray(payload?.data) ? payload.data : [],
            meta: payload?.meta ?? null,
        },
        { status: response.status },
    );
}
