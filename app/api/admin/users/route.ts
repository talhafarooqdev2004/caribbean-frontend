import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function GET() {
    const authHeader = await getAdminAuthorizationHeader();
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const response = await caribApiFetch("/admin/users", { headers: authHeader });
    const payload = await parseCaribApiJson(response);

    return Response.json({ users: Array.isArray(payload?.data) ? payload.data : [] }, { status: response.status });
}
