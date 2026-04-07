import { type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { deleteEnquiryById } from "@/lib/enquiries";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        if (!verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const result = await deleteEnquiryById(id);

        if (result.invalidId) {
            return Response.json({ error: "Invalid enquiry ID." }, { status: 400 });
        }

        if (!result.deleted) {
            return Response.json({ error: "Enquiry not found." }, { status: 404 });
        }

        return Response.json({ message: "Enquiry deleted." });
    } catch {
        return Response.json({ error: "We could not delete that enquiry right now." }, { status: 503 });
    }
}
