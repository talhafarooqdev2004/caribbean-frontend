import { type NextRequest } from "next/server";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await caribApiFetch("/contact-messages", {
            method: "POST",
            body: JSON.stringify(body),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                {
                    error: typeof payload?.message === "string" ? payload.message : "We could not submit your message.",
                    errors: payload?.errors,
                },
                { status: response.status }
            );
        }

        return Response.json(
            {
                message: payload?.message,
                contactMessage: payload?.data,
            },
            { status: response.status }
        );
    } catch {
        return Response.json({ error: "We could not submit your message right now." }, { status: 503 });
    }
}
