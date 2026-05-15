import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { SUBMITTER_SESSION_COOKIE, getSubmitterCookieOptions } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await caribApiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify(body),
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                {
                    error: typeof payload?.message === "string" ? payload.message : "We could not create your account.",
                    errors: payload?.errors,
                },
                { status: response.status }
            );
        }

        const data = payload?.data as { token?: unknown; user?: unknown } | undefined;
        const token = typeof data?.token === "string" ? data.token : "";

        if (token) {
            const cookieStore = await cookies();
            cookieStore.set(SUBMITTER_SESSION_COOKIE, token, getSubmitterCookieOptions());
        }

        return Response.json(
            { message: payload?.message, token, user: data?.user },
            { status: response.status }
        );
    } catch {
        return Response.json({ error: "We could not create your account right now." }, { status: 503 });
    }
}
