import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
    const { id } = await context.params;
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const response = await caribApiFetch(`/admin/users/${id}/credits`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(body),
    });
    const payload = await parseCaribApiJson(response);

    return Response.json(payload ?? { success: false, message: "Unknown error" }, { status: response.status });
}
