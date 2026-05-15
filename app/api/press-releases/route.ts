import { type NextRequest } from "next/server";

import { caribApiFetch, caribApiFetchPublicPressReleaseList, parseCaribApiJson } from "@/lib/backend-api";
import { getSubmitterAuthorizationHeader } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.toString();
    const response = await caribApiFetchPublicPressReleaseList(query);
    const payload = await parseCaribApiJson(response);
    const meta = payload?.meta && typeof payload.meta === "object"
        ? payload.meta as Record<string, unknown>
        : null;

    const headers = new Headers();
    const listCache = response.headers.get("x-api-press-list-cache");
    if (listCache) {
        headers.set("X-API-Press-List-Cache", listCache);
    }

    return Response.json(
        {
            message: payload?.message,
            releases: Array.isArray(payload?.data) ? payload.data : [],
            meta,
            total: typeof meta?.total === "number" ? meta.total : undefined,
            totalPages: typeof meta?.totalPages === "number" ? meta.totalPages : undefined,
            page: typeof meta?.page === "number" ? meta.page : undefined,
            limit: typeof meta?.limit === "number" ? meta.limit : undefined,
        },
        { status: response.status, headers }
    );
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const authHeader = await getSubmitterAuthorizationHeader();
        const response = await caribApiFetch("/press-releases", {
            method: "POST",
            headers: authHeader ?? {},
            body: formData,
        });
        const payload = await parseCaribApiJson(response);

        if (!response.ok) {
            return Response.json(
                {
                    error: typeof payload?.message === "string" ? payload.message : "We could not create your press release.",
                    errors: payload?.errors,
                },
                { status: response.status }
            );
        }

        const rawData = payload?.data;
        const inner = rawData && typeof rawData === "object" && !Array.isArray(rawData)
            ? rawData as Record<string, unknown>
            : null;
        const release = inner?.release ?? rawData;
        const creditsRemaining = typeof inner?.creditsRemaining === "number" ? inner.creditsRemaining : undefined;
        const pendingFeaturedPayment = Boolean(inner?.pendingFeaturedPayment);
        const draftForCreditCheckout = Boolean(inner?.draftForCreditCheckout);

        return Response.json(
            {
                message: payload?.message,
                release,
                creditsRemaining,
                pendingFeaturedPayment,
                draftForCreditCheckout,
            },
            { status: response.status }
        );
    } catch {
        return Response.json({ error: "We could not create your press release right now." }, { status: 503 });
    }
}
