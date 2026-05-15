import { caribApiFetch, getCaribApiMessage, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function GET() {
    const authHeader = await getSubmitterAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await caribApiFetch("/user/submissions", { headers: authHeader });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json({ error: getCaribApiMessage(payload, "Unauthorized") }, { status: response.status });
    }

    return Response.json({ submissions: Array.isArray(payload?.data) ? payload.data : [] }, { status: response.status });
}
