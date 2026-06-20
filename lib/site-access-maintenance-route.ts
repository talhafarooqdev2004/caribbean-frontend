import { type NextRequest } from "next/server";

import { caribApiFetch, getCaribBackendUrl, parseCaribApiJson } from "@/lib/backend-api";
import { isValidSiteAccessControlSecret, readSiteAccessControlSecret } from "@/lib/site-access-control";

type MaintenanceAction = "off" | "on";

export async function handleSiteAccessMaintenanceRequest(
    request: NextRequest,
    action: MaintenanceAction,
) {
    const expected = process.env.SITE_ACCESS_CONTROL_SECRET;

    if (!expected?.trim()) {
        return Response.json(
            { message: "SITE_ACCESS_CONTROL_SECRET is not configured on the frontend." },
            { status: 503 },
        );
    }

    const provided = readSiteAccessControlSecret(request);

    if (!isValidSiteAccessControlSecret(provided, expected)) {
        return Response.json({ message: "Invalid site access control secret." }, { status: 401 });
    }

    try {
        const response = await caribApiFetch(`/site-access/maintenance/${action}`, {
            method: "POST",
            headers: {
                "x-site-access-control-secret": expected.trim(),
            },
        });

        const payload = await parseCaribApiJson(response);

        return Response.json(
            payload ?? {
                message: action === "off"
                    ? "Unable to disable maintenance mode."
                    : "Unable to enable maintenance mode.",
            },
            {
                status: response.status,
                headers: {
                    "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
                },
            },
        );
    } catch (error) {
        const backendUrl = getCaribBackendUrl();
        const detail = error instanceof Error ? error.message : "Unknown error";

        return Response.json(
            {
                message: `Cannot reach Carib API at ${backendUrl}. Start the backend server, then try again.`,
                detail,
            },
            {
                status: 503,
                headers: {
                    "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
                },
            },
        );
    }
}
