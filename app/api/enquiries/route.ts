import { type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { listEnquiries } from "@/lib/enquiries";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        if (!verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const enquiries = await listEnquiries();

        return Response.json({ enquiries });
    } catch {
        return Response.json({ error: "We could not load enquiries right now." }, { status: 503 });
    }
}
