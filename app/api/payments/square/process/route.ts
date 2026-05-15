import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const authHeader = await getSubmitterAuthorizationHeader();
        const response = await caribApiFetch("/payments/square/process", {
            method: "POST",
            headers: authHeader ?? {},
            body: JSON.stringify(body),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            const message = typeof payload?.message === "string" && payload.message.trim().length > 0
                ? payload.message.trim()
                : "We could not complete your payment. Please try again.";
            return Response.json({ error: message }, { status: response.status });
        }

        return Response.json(payload?.data ?? {}, { status: response.status });
    } catch {
        return Response.json({ error: "We could not reach the payment service. Please try again shortly." }, { status: 503 });
    }
}
