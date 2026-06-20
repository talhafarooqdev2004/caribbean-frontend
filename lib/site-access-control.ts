import { type NextRequest } from "next/server";

export function readSiteAccessControlSecret(request: NextRequest): string {
    const headerSecret = request.headers.get("x-site-access-control-secret")?.trim();

    if (headerSecret) {
        return headerSecret;
    }

    const authorization = request.headers.get("authorization")?.trim();

    if (authorization) {
        const bearer = authorization.replace(/^Bearer\s+/i, "").trim();

        if (bearer) {
            return bearer;
        }
    }

    return request.nextUrl.searchParams.get("token")?.trim() ?? "";
}

export function isValidSiteAccessControlSecret(provided: string, expected: string | undefined) {
    const configured = expected?.trim();

    return Boolean(configured && provided && provided === configured);
}
