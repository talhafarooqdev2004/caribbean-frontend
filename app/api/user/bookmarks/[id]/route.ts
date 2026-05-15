import { type NextRequest } from "next/server";

import { caribApiFetch, getCaribApiMessage, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, context: RouteContext) {
    const authHeader = await getSubmitterAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const response = await caribApiFetch(`/user/bookmarks/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeader,
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json({ error: getCaribApiMessage(payload, "Remove failed") }, { status: response.status });
    }

    return Response.json({ message: payload?.message }, { status: response.status });
}
