import { type NextRequest } from "next/server";

import { caribApiFetch, getCaribApiMessage, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
    const authHeader = await getSubmitterAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const keys = Object.keys(body as Record<string, unknown>);
    const invalid = keys.filter((key) => key !== "digestOptedIn");

    if (invalid.length > 0) {
        return Response.json(
            { error: `Invalid field(s): ${invalid.join(", ")}. Only digestOptedIn is allowed.` },
            { status: 400 },
        );
    }

    if (typeof (body as { digestOptedIn?: unknown }).digestOptedIn !== "boolean") {
        return Response.json({ error: "digestOptedIn (boolean) is required" }, { status: 400 });
    }

    const response = await caribApiFetch("/user/digest-settings", {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify({ digestOptedIn: (body as { digestOptedIn: boolean }).digestOptedIn }),
    });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json({ error: getCaribApiMessage(payload, "Update failed") }, { status: response.status });
    }

    return Response.json({ profile: payload?.data }, { status: response.status });
}
