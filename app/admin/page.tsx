import { redirect } from "next/navigation";

import AdminEnquiriesPanel from "@/components/admin/AdminEnquiriesPanel";
import { isAdminSessionValidFromCookies } from "@/lib/admin-auth";
import { listEnquiries, type EnquiryRecord } from "@/lib/enquiries";

export default async function AdminPage() {
    const isAuthenticated = await isAdminSessionValidFromCookies();

    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    let enquiries: EnquiryRecord[] = [];
    let initialLoadError: string | undefined;

    try {
        enquiries = await listEnquiries();
    } catch {
        initialLoadError = "We could not load enquiries right now. Please refresh after checking MongoDB.";
    }

    return <AdminEnquiriesPanel initialEnquiries={enquiries} initialLoadError={initialLoadError} />;
}
