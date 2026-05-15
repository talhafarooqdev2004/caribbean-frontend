import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        releaseId: string;
    }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
    const { releaseId } = await context.params;
    const response = await caribApiFetch(`/payments/square/release/${encodeURIComponent(releaseId)}`);
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json({ error: typeof payload?.message === "string" ? payload.message : "Payment not found." }, { status: response.status });
    }

    const data = payload?.data as { payment?: unknown; release?: unknown } | undefined;
    return Response.json({ payment: data?.payment, release: data?.release ?? null }, { status: response.status });
}
