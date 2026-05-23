import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { listEnquiries } from "@/lib/enquiries";
import { type EnquiryStatus } from "@/lib/enquiry-types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        if (!(await getAdminAuthorizationHeader())) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const page = request.nextUrl.searchParams.get("page") ?? "1";
        const limit = request.nextUrl.searchParams.get("limit") ?? "8";
        const status = request.nextUrl.searchParams.get("status");
        const statusFilter =
            status === "pending" || status === "approved" || status === "rejected"
                ? (status as EnquiryStatus)
                : undefined;

        const { enquiries, meta } = await listEnquiries({
            page: Number(page),
            limit: Number(limit),
            status: statusFilter,
        });

        return Response.json({ enquiries, meta });
    } catch {
        return Response.json({ error: "We could not load enquiries right now." }, { status: 503 });
    }
}
