import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        orderId: string;
    }>;
};

export async function GET(_request: Request, context: RouteContext) {
    const { orderId } = await context.params;
    const response = await caribApiFetch(`/payments/square/order/${encodeURIComponent(orderId)}`);
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json({ error: typeof payload?.message === "string" ? payload.message : "Payment not found." }, { status: response.status });
    }

    const data = payload?.data as { payment?: unknown; release?: unknown } | undefined;
    return Response.json({ payment: data?.payment, release: data?.release }, { status: response.status });
}
