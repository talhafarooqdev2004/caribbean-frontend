import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const response = await caribApiFetch("/network-stats");
    const payload = await parseCaribApiJson(response);
    const data = payload?.data;

    return Response.json(data ?? null, {
        status: response.ok ? 200 : 502,
        headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
    });
}
