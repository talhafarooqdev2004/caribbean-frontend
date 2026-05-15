import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function GET() {
    const authHeader = await getAdminAuthorizationHeader();
    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await caribApiFetch("/admin/contact-messages", { headers: authHeader });
    const payload = await parseCaribApiJson(response);

    return Response.json(
        {
            contactMessages: Array.isArray(payload?.data) ? payload.data : [],
            message: typeof payload?.message === "string" ? payload.message : undefined,
        },
        { status: response.status },
    );
}
