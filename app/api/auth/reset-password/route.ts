import { type NextRequest } from "next/server";

import { caribApiFetch, getCaribApiMessage, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await caribApiFetch("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({
                token: body.token,
                password: body.password,
            }),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                { error: getCaribApiMessage(payload, "We could not reset your password.") },
                { status: response.status }
            );
        }

        return Response.json({ message: getCaribApiMessage(payload, "Password updated.") }, { status: response.status });
    } catch {
        return Response.json({ error: "We could not reset your password right now." }, { status: 503 });
    }
}
