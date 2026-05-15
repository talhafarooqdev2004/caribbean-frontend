import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const expected = process.env.MW_SITE_ACCESS_SECRET || "dev-insecure";

    if (request.headers.get("x-mw-site-access") !== expected) {
        return new Response(null, { status: 404 });
    }

    const response = await caribApiFetch("/site-access");
    const payload = await parseCaribApiJson(response);
    const data = payload?.data as { restrictEnabled?: boolean; allowedIps?: string[] } | undefined;

    return Response.json(
        {
            restrictEnabled: Boolean(data?.restrictEnabled),
            allowedIps: Array.isArray(data?.allowedIps) ? data.allowedIps : [],
        },
        { status: response.ok ? 200 : 502 },
    );
}
