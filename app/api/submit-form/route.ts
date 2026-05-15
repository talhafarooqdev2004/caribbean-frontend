import { type NextRequest } from "next/server";

import { insertEnquiry, validateAndInsertableEnquiry } from "@/lib/enquiries";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        let payload: Record<string, unknown>;

        try {
            payload = (await request.json()) as Record<string, unknown>;
        } catch {
            return Response.json({ error: "Invalid request body." }, { status: 400 });
        }

        const { values, errors } = validateAndInsertableEnquiry({
            firstName: typeof payload.firstName === "string" ? payload.firstName : "",
            lastName: typeof payload.lastName === "string" ? payload.lastName : "",
            email: typeof payload.email === "string" ? payload.email : "",
            publicationName: typeof payload.publicationName === "string" ? payload.publicationName : "",
            role: typeof payload.role === "string" ? payload.role : "",
            coverageArea: typeof payload.coverageArea === "string" ? payload.coverageArea : "",
            region: typeof payload.region === "string" ? payload.region : "",
            website: typeof payload.website === "string" ? payload.website : "",
            notes: typeof payload.notes === "string" ? payload.notes : "",
        });
        const requestId = typeof payload.requestId === "string" ? payload.requestId.trim() : "";

        if (!values) {
            return Response.json(
                {
                    error: "Please correct the highlighted fields.",
                    fieldErrors: errors,
                },
                { status: 422 }
            );
        }

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
            return Response.json(
                {
                    error: "Please refresh the form and try again.",
                },
                { status: 422 }
            );
        }

        const enquiry = await insertEnquiry({
            ...values,
            requestId,
        });

        return Response.json(
            {
                message: "Your enquiry was submitted successfully.",
                enquiry,
            },
            { status: 201 }
        );
    } catch {
        return Response.json(
            {
                error: "We could not submit your enquiry right now.",
            },
            { status: 503 }
        );
    }
}
