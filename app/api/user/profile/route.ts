import { type NextRequest } from "next/server";

import { caribApiFetch, getCaribApiMessage, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function GET() {
    const authHeader = await getSubmitterAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await caribApiFetch("/user/profile", { headers: authHeader });
    const payload = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json({ error: getCaribApiMessage(payload, "Unauthorized") }, { status: response.status });
    }

    return Response.json({ profile: payload?.data }, { status: response.status });
}

export async function PUT(request: NextRequest) {
    const authHeader = await getSubmitterAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const record = body as Record<string, unknown>;
    const invalid = Object.keys(record).filter((key) => key !== "primaryBeat" && key !== "bio");

    if (invalid.length > 0) {
        return Response.json(
            { error: `Invalid field(s): ${invalid.join(", ")}. Only primaryBeat and bio are allowed.` },
            { status: 400 },
        );
    }

    const profileBody: { primaryBeat?: string; bio?: string } = {};

    if ("primaryBeat" in record && typeof record.primaryBeat !== "string") {
        return Response.json({ error: "primaryBeat must be a string" }, { status: 400 });
    }

    if ("bio" in record && typeof record.bio !== "string") {
        return Response.json({ error: "bio must be a string" }, { status: 400 });
    }

    if (typeof record.primaryBeat === "string") {
        profileBody.primaryBeat = record.primaryBeat;
    }

    if (typeof record.bio === "string") {
        profileBody.bio = record.bio;
    }

    const response = await caribApiFetch("/user/profile", {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(profileBody),
    });
    const profileApiResult = await parseCaribApiJson(response);

    if (!response.ok) {
        return Response.json({ error: getCaribApiMessage(profileApiResult, "Update failed") }, { status: response.status });
    }

    return Response.json({ profile: profileApiResult?.data }, { status: response.status });
}
