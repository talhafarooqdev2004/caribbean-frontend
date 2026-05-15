import "server-only";

import { cookies } from "next/headers";
import { caribApiFetch } from "./backend-api";

export const ADMIN_SESSION_COOKIE = "caribbean_news_admin_token";

const SESSION_TTL_SECONDS = 60 * 60 * 8;

export function getAdminCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
    };
}

export async function getAdminSessionTokenFromCookies() {
    const cookieStore = await cookies();
    return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function isAdminSessionValidFromCookies() {
    const token = await getAdminSessionTokenFromCookies();

    if (!token) {
        return false;
    }

    try {
        const response = await caribApiFetch("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.ok;
    } catch {
        return false;
    }
}

export async function getAdminAuthorizationHeader() {
    const token = await getAdminSessionTokenFromCookies();

    return token ? { Authorization: `Bearer ${token}` } : null;
}
