import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, getAdminCookieOptions } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const payload = (await request.json()) as Record<string, unknown>;
        const username = typeof payload.username === "string" ? payload.username : "";
        const password = typeof payload.password === "string" ? payload.password : "";

        if (!username || !password) {
            return Response.json({ error: "Username and password are required." }, { status: 422 });
        }

        const backendResponse = await caribApiFetch("/auth/admin/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
            }),
        });
        const backendPayload = await parseCaribApiJson(backendResponse);

        if (!backendResponse.ok) {
            return Response.json(
                { error: typeof backendPayload?.message === "string" ? backendPayload.message : "Invalid credentials." },
                { status: backendResponse.status }
            );
        }

        const token = typeof (backendPayload?.data as { token?: unknown } | undefined)?.token === "string"
            ? (backendPayload?.data as { token: string }).token
            : "";

        if (!token) {
            return Response.json({ error: "Admin token was not returned by backend." }, { status: 502 });
        }

        const cookieStore = await cookies();
        cookieStore.set(ADMIN_SESSION_COOKIE, token, getAdminCookieOptions());

        return Response.json({ message: "Signed in successfully." });
    } catch (error) {
        console.error("Admin login failed.", error);

        return Response.json({ error: "We could not sign you in right now." }, { status: 500 });
    }
}
