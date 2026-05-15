import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

/**
 * One browser round-trip for portal shell: server fans out to four cached backend reads (Redis when enabled).
 */
export async function GET() {
    const authHeader = await getSubmitterAuthorizationHeader();

    if (!authHeader) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const headers = { headers: authHeader };

    const [pRes, cRes, sRes, bRes] = await Promise.all([
        caribApiFetch("/user/profile", headers),
        caribApiFetch("/user/credits", headers),
        caribApiFetch("/user/submissions", headers),
        caribApiFetch("/user/bookmarks", headers),
    ]);

    const [pPayload, cPayload, sPayload, bPayload] = await Promise.all([
        parseCaribApiJson(pRes),
        parseCaribApiJson(cRes),
        parseCaribApiJson(sRes),
        parseCaribApiJson(bRes),
    ]);

    if (!pRes.ok) {
        return Response.json(
            { error: typeof pPayload?.message === "string" ? pPayload.message : "Unauthorized" },
            { status: pRes.status },
        );
    }

    return Response.json(
        {
            profile: pRes.ok ? pPayload?.data : null,
            credits: cRes.ok ? cPayload?.data : null,
            submissions: sRes.ok && Array.isArray(sPayload?.data) ? sPayload.data : [],
            bookmarks: bRes.ok && Array.isArray(bPayload?.data) ? bPayload.data : [],
        },
        { status: 200 },
    );
}
