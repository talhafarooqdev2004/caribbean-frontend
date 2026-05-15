import "server-only";

import { cookies } from "next/headers";
import { caribApiFetch, parseCaribApiJson } from "./backend-api";

export const SUBMITTER_SESSION_COOKIE = "caribbean_news_submitter_token";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export function getSubmitterCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
    };
}

export async function getSubmitterSessionTokenFromCookies() {
    const cookieStore = await cookies();
    return cookieStore.get(SUBMITTER_SESSION_COOKIE)?.value ?? null;
}

export async function getSubmitterAuthorizationHeader() {
    const token = await getSubmitterSessionTokenFromCookies();
    return token ? { Authorization: `Bearer ${token}` } : null;
}

export async function getSubmitterSessionUser() {
    const authHeader = await getSubmitterAuthorizationHeader();

    if (!authHeader) {
        return null;
    }

    try {
        const response = await caribApiFetch("/auth/me", {
            headers: authHeader,
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok || !payload?.data) {
            return null;
        }

        return payload.data as {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            phone: string | null;
            organization: string | null;
            credits: number;
            bundleCreditsRemaining?: number;
            permanentCredits?: number;
            creditsExpiresAt: string | null;
            bundleCreditsExpiresAt?: string | null;
            packageType: string | null;
        };
    } catch {
        return null;
    }
}
