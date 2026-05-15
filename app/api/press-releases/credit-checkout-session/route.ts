import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const authHeader = await getSubmitterAuthorizationHeader();
        const response = await caribApiFetch("/press-releases/credit-checkout-session", {
            method: "POST",
            headers: authHeader ?? {},
            body: formData,
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                {
                    error: typeof payload?.message === "string" ? payload.message : "We could not start checkout.",
                    errors: payload?.errors,
                },
                { status: response.status },
            );
        }

        const rawData = payload?.data;
        const inner = rawData && typeof rawData === "object" && !Array.isArray(rawData)
            ? rawData as Record<string, unknown>
            : null;

        return Response.json(
            {
                message: payload?.message,
                creditCheckoutSessionId: typeof inner?.creditCheckoutSessionId === "string"
                    ? inner.creditCheckoutSessionId
                    : undefined,
                creditCheckoutSession: Boolean(inner?.creditCheckoutSession),
            },
            { status: response.status },
        );
    } catch {
        return Response.json({ error: "We could not start checkout right now." }, { status: 503 });
    }
}
