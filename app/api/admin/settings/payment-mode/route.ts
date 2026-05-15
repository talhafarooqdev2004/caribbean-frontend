import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function GET() {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await caribApiFetch("/admin/settings/payment-mode", {
        headers: authHeader,
    });
    const payload = await parseCaribApiJson(response);

    return Response.json(payload?.data ?? {}, { status: response.status });
}

export async function PUT(request: NextRequest) {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const response = await caribApiFetch("/admin/settings/payment-mode", {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(body),
    });
    const payload = await parseCaribApiJson(response);

    return Response.json(payload?.data ?? {}, { status: response.status });
}
