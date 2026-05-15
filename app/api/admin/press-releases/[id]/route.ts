import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function parseStatus(value: unknown) {
    return value === "pending" || value === "approved" || value === "rejected" ? value : null;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;

    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const status = parseStatus(body.status);

    if (!status) {
        return Response.json({ error: "Invalid press release status." }, { status: 400 });
    }

    const { id } = await context.params;
    const response = await caribApiFetch(`/press-releases/admin/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: authHeader,
        body: JSON.stringify({
            status,
            rejectionReason: typeof body.rejectionReason === "string" ? body.rejectionReason : "",
        }),
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json(
            { error: typeof payload?.message === "string" ? payload.message : "Unable to update press release." },
            { status: response.status }
        );
    }

    return Response.json({
        message: payload?.message,
        release: payload?.data,
    });
}

export async function PUT(request: NextRequest, context: RouteContext) {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = await context.params;
    const response = await caribApiFetch(`/admin/press-releases/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(body),
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json(
            {
                error: typeof payload?.message === "string" ? payload.message : "Unable to update press release.",
                message: payload?.message,
            },
            { status: response.status }
        );
    }

    return Response.json({ message: payload?.message, release: payload?.data }, { status: response.status });
}
