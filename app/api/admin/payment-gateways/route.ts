import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function GET() {
    try {
        const authHeader = await getAdminAuthorizationHeader();

        if (!authHeader) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await caribApiFetch("/admin/payment-gateways", {
            headers: authHeader,
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                { error: typeof payload?.message === "string" ? payload.message : "We could not load payment gateways." },
                { status: response.status }
            );
        }

        return Response.json(
            {
                gateways: Array.isArray(payload?.data) ? payload.data : [],
            },
            { status: response.status }
        );
    } catch {
        return Response.json({ error: "Carib backend is not reachable." }, { status: 503 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const authHeader = await getAdminAuthorizationHeader();

        if (!authHeader) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json().catch(() => ({}));
        const response = await caribApiFetch("/admin/payment-gateways/square/test-mode", {
            method: "PUT",
            headers: authHeader,
            body: JSON.stringify({ testMode: Boolean(body.testMode) }),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                { error: typeof payload?.message === "string" ? payload.message : "We could not update Square mode." },
                { status: response.status }
            );
        }

        return Response.json(
            {
                message: payload?.message,
                config: payload?.data,
            },
            { status: response.status }
        );
    } catch {
        return Response.json({ error: "Carib backend is not reachable." }, { status: 503 });
    }
}
