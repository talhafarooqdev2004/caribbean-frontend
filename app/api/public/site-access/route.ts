import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public read of site IP policy (from MongoDB via EC2). Used by Edge middleware on every request. */
export async function GET() {
    const response = await caribApiFetch("/site-access");
    const payload = await parseCaribApiJson(response);
    const data = payload?.data as { restrictEnabled?: boolean; allowedIps?: string[] } | undefined;

    return Response.json(
        {
            restrictEnabled: Boolean(data?.restrictEnabled),
            allowedIps: Array.isArray(data?.allowedIps) ? data.allowedIps : [],
        },
        {
            status: response.ok ? 200 : 502,
            headers: {
                "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
            },
        },
    );
}
