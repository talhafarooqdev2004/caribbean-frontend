import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, getCaribApiMessage, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const formData = await request.formData();

    const response = await caribApiFetch(`/admin/press-releases/${encodeURIComponent(id)}/files`, {
        method: "PUT",
        headers: authHeader,
        body: formData,
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json(
            {
                error: getCaribApiMessage(payload, "Unable to upload files."),
                message: payload?.message,
            },
            { status: response.status }
        );
    }

    return Response.json({ message: payload?.message, release: payload?.data }, { status: response.status });
}
