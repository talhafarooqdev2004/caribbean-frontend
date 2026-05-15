import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const authHeader = await getSubmitterAuthorizationHeader();
        const response = await caribApiFetch("/payments/square/checkout", {
            method: "POST",
            headers: authHeader ?? {},
            body: JSON.stringify(body),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                {
                    error: typeof payload?.message === "string" ? payload.message : "We could not create Square checkout.",
                    errors: payload?.errors,
                },
                { status: response.status }
            );
        }

        return Response.json(payload?.data ?? {}, { status: response.status });
    } catch {
        return Response.json({ error: "We could not create Square checkout right now." }, { status: 503 });
    }
}
