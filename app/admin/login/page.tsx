import { redirect } from "next/navigation";

import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { isAdminSessionValidFromCookies } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
    const isAuthenticated = await isAdminSessionValidFromCookies();

    if (isAuthenticated) {
        redirect("/admin");
    }

    return <AdminLoginForm />;
}

