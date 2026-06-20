import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(_request: NextRequest, context: RouteContext) {
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const response = await caribApiFetch(`/admin/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeader,
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json(
            { error: typeof payload?.message === "string" ? payload.message : "Unable to delete user." },
            { status: response.status },
        );
    }

    return Response.json({
        message: typeof payload?.message === "string" ? payload.message : "User deleted successfully.",
    });
}
