import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { caribApiFetch, getCaribApiMessage, parseCaribApiJson } from "@/lib/backend-api";
import { SUBMITTER_SESSION_COOKIE, getSubmitterCookieOptions } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await caribApiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: body.email,
                password: body.password,
            }),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            const backendMessage = getCaribApiMessage(payload, "");
            const error =
                backendMessage === "Invalid credentials" || !backendMessage
                    ? "Invalid email or password."
                    : backendMessage;
            return Response.json({ error }, { status: response.status });
        }

        const data = payload?.data as { token?: unknown; user?: unknown } | undefined;
        const token = typeof data?.token === "string" ? data.token : "";

        if (!token) {
            return Response.json({ error: "Login token was not returned." }, { status: 502 });
        }

        const cookieStore = await cookies();
        cookieStore.set(SUBMITTER_SESSION_COOKIE, token, getSubmitterCookieOptions());

        return Response.json({ message: payload?.message, token, user: data?.user });
    } catch {
        return Response.json({ error: "We could not sign you in right now." }, { status: 503 });
    }
}
