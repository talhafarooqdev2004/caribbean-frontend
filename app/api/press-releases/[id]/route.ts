import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    const authHeader = await getSubmitterAuthorizationHeader();
    const response = await caribApiFetch(`/press-releases/${encodeURIComponent(id)}`, {
        headers: authHeader ?? {},
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json(
            { error: typeof payload?.message === "string" ? payload.message : "Press release not found." },
            { status: response.status }
        );
    }

    return Response.json(
        {
            message: payload?.message,
            release: payload?.data,
        },
        { status: response.status }
    );
}
