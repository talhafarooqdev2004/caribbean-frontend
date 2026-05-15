import { type NextRequest } from "next/server";

import { caribApiFetch, getCaribApiMessage, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await caribApiFetch("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email: body.email }),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                { error: getCaribApiMessage(payload, "We could not process that request.") },
                { status: response.status }
            );
        }

        return Response.json({ message: getCaribApiMessage(payload, "Request received.") }, { status: response.status });
    } catch {
        return Response.json({ error: "We could not process that request right now." }, { status: 503 });
    }
}
