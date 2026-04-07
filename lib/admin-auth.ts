import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "caribbean_news_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAdminConfig() {
    const isProduction = process.env.NODE_ENV === "production";
    const username = process.env.ADMIN_USERNAME ?? (isProduction ? undefined : "admin");
    const password = process.env.ADMIN_PASSWORD ?? (isProduction ? undefined : "CaribNews@123");
    const secret = process.env.ADMIN_AUTH_SECRET ?? (isProduction ? undefined : "caribnews-admin-dev-secret");

    if (!username || !password || !secret) {
        throw new Error("Missing ADMIN_USERNAME, ADMIN_PASSWORD, or ADMIN_AUTH_SECRET environment variables.");
    }

    return { username, password, secret };
}

function base64UrlEncode(value: string) {
    return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
    return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string, secret: string) {
    return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function secureEquals(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminSessionToken(token: string | undefined | null) {
    if (!token) {
        return false;
    }

    let config: ReturnType<typeof getAdminConfig>;

    try {
        config = getAdminConfig();
    } catch {
        return false;
    }

    const { username, secret } = config;

    const [payloadPart, signature] = token.split(".");

    if (!payloadPart || !signature) {
        return false;
    }

    let parsedPayload: { username?: string; expiresAt?: number } | null = null;

    try {
        parsedPayload = JSON.parse(base64UrlDecode(payloadPart)) as { username?: string; expiresAt?: number };
    } catch {
        return false;
    }

    if (!parsedPayload || parsedPayload.username !== username || typeof parsedPayload.expiresAt !== "number") {
        return false;
    }

    if (Date.now() > parsedPayload.expiresAt) {
        return false;
    }

    const expectedSignature = signPayload(payloadPart, secret);

    return secureEquals(signature, expectedSignature);
}

export function createAdminSessionToken() {
    const { username, secret } = getAdminConfig();
    const payload = base64UrlEncode(
        JSON.stringify({
            username,
            expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
        })
    );

    return `${payload}.${signPayload(payload, secret)}`;
}

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
    return verifyAdminSessionToken(await getAdminSessionTokenFromCookies());
}

export function validateAdminCredentials(username: string, password: string) {
    const config = getAdminConfig();

    return secureEquals(username, config.username) && secureEquals(password, config.password);
}
