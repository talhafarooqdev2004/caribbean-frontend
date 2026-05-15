import { type NextRequest } from "next/server";

import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import {
    approveEnquiryById,
    deleteEnquiryById,
    rejectEnquiryById,
    revertEnquiryById,
} from "@/lib/enquiries";
import { type EnquiryStatus } from "@/lib/enquiry-types";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        if (!(await getAdminAuthorizationHeader())) {
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

function parseStatus(value: unknown): EnquiryStatus | null {
    if (value === "pending" || value === "approved" || value === "rejected") {
        return value;
    }

    return null;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        if (!(await getAdminAuthorizationHeader())) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        let payload: Record<string, unknown>;

        try {
            payload = (await request.json()) as Record<string, unknown>;
        } catch {
            return Response.json({ error: "Invalid request body." }, { status: 400 });
        }

        const status = parseStatus(payload.status);

        if (!status) {
            return Response.json({ error: "Invalid enquiry status." }, { status: 400 });
        }

        const { id } = await context.params;

        const result =
            status === "approved"
                ? await approveEnquiryById(id)
                : status === "rejected"
                    ? await rejectEnquiryById(id)
                    : await revertEnquiryById(id);

        if (result.invalidId) {
            return Response.json({ error: "Invalid enquiry ID." }, { status: 400 });
        }

        if (result.notFound) {
            return Response.json({ error: "Enquiry not found." }, { status: 404 });
        }

        return Response.json({
            message: `Enquiry marked as ${status}.`,
            enquiry: result.enquiry,
        });
    } catch {
        return Response.json({ error: "We could not update that enquiry right now." }, { status: 503 });
    }
}
