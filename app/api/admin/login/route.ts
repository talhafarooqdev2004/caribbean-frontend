import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { createAdminSessionToken, getAdminCookieOptions, validateAdminCredentials } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const payload = (await request.json()) as Record<string, unknown>;
        const username = typeof payload.username === "string" ? payload.username : "";
        const password = typeof payload.password === "string" ? payload.password : "";

        if (!username || !password) {
            return Response.json({ error: "Username and password are required." }, { status: 422 });
        }

        if (!validateAdminCredentials(username, password)) {
            return Response.json({ error: "Invalid credentials." }, { status: 401 });
        }

        const cookieStore = await cookies();
        cookieStore.set("caribbean_news_admin_session", createAdminSessionToken(), getAdminCookieOptions());

        return Response.json({ message: "Signed in successfully." });
    } catch (error) {
        console.error("Admin login failed.", error);

        return Response.json({ error: "We could not sign you in right now." }, { status: 500 });
    }
}
