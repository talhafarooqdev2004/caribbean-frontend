import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import {
    CHECKOUT_SESSION_EXPIRED_MESSAGE,
    resolveCheckoutStartError,
} from "@/lib/checkout-session-errors";
import { getSubmitterAuthorizationHeader, getSubmitterSessionUser } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const authHeader = await getSubmitterAuthorizationHeader();

        if (!authHeader) {
            return Response.json(
                { error: CHECKOUT_SESSION_EXPIRED_MESSAGE },
                { status: 401 },
            );
        }

        const user = await getSubmitterSessionUser();

        if (!user) {
            return Response.json(
                { error: CHECKOUT_SESSION_EXPIRED_MESSAGE },
                { status: 401 },
            );
        }

        const formData = await request.formData();
        const response = await caribApiFetch("/press-releases/credit-checkout-session", {
            method: "POST",
            headers: authHeader,
            body: formData,
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                {
                    error: resolveCheckoutStartError(payload, response.status),
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
        return Response.json(
            {
                error: "We could not reach our server. Check your connection and try again in a moment.",
            },
            { status: 503 },
        );
    }
}
