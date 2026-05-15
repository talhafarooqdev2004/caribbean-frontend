import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(_request: Request, context: RouteContext) {
    const { id } = await context.params;
    const response = await caribApiFetch(`/press-releases/${encodeURIComponent(id)}/click`, {
        method: "POST",
    });
    const payload = await parseCaribApiJson(response);

    return Response.json({ message: payload?.message, release: payload?.data }, { status: response.status });
}
