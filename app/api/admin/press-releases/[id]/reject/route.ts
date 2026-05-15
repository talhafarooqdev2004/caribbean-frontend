import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
    const authHeader = await getAdminAuthorizationHeader();
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await request.json();
    const response = await caribApiFetch(`/admin/press-releases/${encodeURIComponent(id)}/reject`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(body),
    });
    const payload = await parseCaribApiJson(response);

    return Response.json({ release: payload?.data }, { status: response.status });
}
