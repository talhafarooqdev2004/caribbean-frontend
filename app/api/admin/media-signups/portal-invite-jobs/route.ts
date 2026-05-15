import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
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

        const response = await caribApiFetch("/admin/media-signups/portal-invite-jobs", {
            method: "POST",
            headers: authHeader,
            body: JSON.stringify(body),
        });
        const payload = await parseCaribApiJson(response);

        return Response.json(payload ?? { success: false, message: "Unknown error" }, { status: response.status });
    } catch {
        return Response.json({ success: false, message: "We could not queue portal invites right now." }, { status: 503 });
    }
}
