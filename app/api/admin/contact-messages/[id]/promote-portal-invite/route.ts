import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { id } = await context.params;
    const authHeader = await getAdminAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await caribApiFetch(`/admin/contact-messages/${id}/promote-portal-invite`, {
        method: "POST",
        headers: authHeader,
    });
    const payload = await parseCaribApiJson(response);

    return Response.json(payload ?? { success: false, message: "Unknown error" }, { status: response.status });
}
