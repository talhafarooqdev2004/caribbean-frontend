import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function GET() {
    const authHeader = await getAdminAuthorizationHeader();
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const response = await caribApiFetch("/admin/analytics", { headers: authHeader });
    const payload = await parseCaribApiJson(response);

    return Response.json(payload?.data ?? {}, { status: response.status });
}
