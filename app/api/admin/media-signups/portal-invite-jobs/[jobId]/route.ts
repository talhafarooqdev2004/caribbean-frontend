import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        jobId: string;
    }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const authHeader = await getAdminAuthorizationHeader();
        if (!authHeader) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobId } = await context.params;
        const response = await caribApiFetch(`/admin/media-signups/portal-invite-jobs/${encodeURIComponent(jobId)}`, {
            method: "GET",
            headers: authHeader,
        });
        const payload = await parseCaribApiJson(response);

        return Response.json(payload ?? { success: false, message: "Unknown error" }, { status: response.status });
    } catch {
        return Response.json({ success: false, message: "We could not load invite job status." }, { status: 503 });
    }
}
