import { redirect } from "next/navigation";

import AdminEnquiriesPanel from "@/components/admin/AdminEnquiriesPanel";
import { getAdminAuthorizationHeader, isAdminSessionValidFromCookies } from "@/lib/admin-auth";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { listContactMessagesForAdmin } from "@/lib/contact-messages";
import { listEnquiries } from "@/lib/enquiries";
import { type EnquiryRecord } from "@/lib/enquiry-types";
import { type PressReleaseRecord } from "@/lib/press-release-types";

export default async function AdminPage() {
    const isAuthenticated = await isAdminSessionValidFromCookies();

    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    let enquiries: EnquiryRecord[] = [];
    let pressReleases: PressReleaseRecord[] = [];
    let pressReleaseTotal = 0;
    let pressReleaseQueueCounts: { pending: number; approved: number; rejected: number } = {
        pending: 0,
        approved: 0,
        rejected: 0,
    };
    let initialLoadError: string | undefined;
    let initialPaymentGateway = null;
    let initialContactMessages: Awaited<ReturnType<typeof listContactMessagesForAdmin>> = [];

    try {
        enquiries = await listEnquiries();
    } catch {
        initialLoadError = "We could not load enquiries right now. Please refresh after checking MongoDB.";
    }

    try {
        const authHeader = await getAdminAuthorizationHeader();
        if (authHeader) {
            try {
                initialContactMessages = await listContactMessagesForAdmin();
            } catch {
                initialContactMessages = [];
            }

            const response = await caribApiFetch("/admin/payment-gateways", {
                headers: authHeader,
            });
            const payload = await parseCaribApiJson(response);
            initialPaymentGateway = Array.isArray(payload?.data) ? payload.data[0] : null;

            const releasesResponse = await caribApiFetch("/press-releases/admin/all/list?sort=adminQueue&limit=8&page=1&paymentStatus=paid&status=pending", {
                headers: authHeader,
            });
            const releasesPayload = await parseCaribApiJson(releasesResponse);
            pressReleases = Array.isArray(releasesPayload?.data) ? releasesPayload.data as PressReleaseRecord[] : [];
            const releasesMeta = releasesPayload?.meta as {
                total?: number;
                paidQueueCounts?: { pending: number; approved: number; rejected: number };
            } | undefined;
            pressReleaseTotal = typeof releasesMeta?.total === "number" ? releasesMeta.total : pressReleases.length;
            if (releasesMeta?.paidQueueCounts && typeof releasesMeta.paidQueueCounts === "object") {
                pressReleaseQueueCounts = {
                    pending: Number(releasesMeta.paidQueueCounts.pending) || 0,
                    approved: Number(releasesMeta.paidQueueCounts.approved) || 0,
                    rejected: Number(releasesMeta.paidQueueCounts.rejected) || 0,
                };
            }
        }
    } catch {
        initialPaymentGateway = null;
    }

    return (
        <AdminEnquiriesPanel
            initialEnquiries={enquiries}
            initialPressReleases={pressReleases}
            initialPressReleaseTotal={pressReleaseTotal}
            initialPressReleaseQueueCounts={pressReleaseQueueCounts}
            initialLoadError={initialLoadError}
            initialPaymentGateway={initialPaymentGateway}
            initialContactMessages={initialContactMessages}
        />
    );
}
