import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { formatApiValidationErrors } from "@/lib/format-api-validation-errors";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await caribApiFetch("/newsletter/subscribe", {
            method: "POST",
            body: JSON.stringify(body),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                {
                    error: formatApiValidationErrors(payload, "We could not subscribe you right now."),
                    errors: payload?.errors,
                },
                { status: response.status }
            );
        }

        return Response.json(
            {
                message: typeof payload?.message === "string" ? payload.message : "You are subscribed to the news digest.",
                data: payload?.data,
            },
            { status: response.status }
        );
    } catch {
        return Response.json({ error: "We could not subscribe you right now." }, { status: 503 });
    }
}
