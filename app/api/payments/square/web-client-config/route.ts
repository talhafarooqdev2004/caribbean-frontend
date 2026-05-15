import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

/** Proxies minimal Square Web Payments bootstrap (appId, locationId, sdkUrl only). */
export async function GET() {
    const response = await caribApiFetch("/payments/square/web-client-config");
    const payload = await parseCaribApiJson(response);

    return Response.json(payload?.data ?? {}, { status: response.status });
}
