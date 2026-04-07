import { NextResponse, type NextRequest } from "next/server";

const allowedPaths = ["/media-signup", "/admin", "/admin/login"];

function isAllowedPath(pathname: string) {
    if (allowedPaths.includes(pathname)) {
        return true;
    }

    return allowedPaths.some((allowedPath) => pathname.startsWith(`${allowedPath}/`));
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isAllowedPath(pathname)) {
        return NextResponse.next();
    }

    return NextResponse.rewrite(new URL("/__caribnews_temporary_unavailable__", request.url));
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
