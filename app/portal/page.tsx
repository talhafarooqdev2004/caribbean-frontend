import PortalPageClient from "@/components/portal/PortalPageClient";
import { getSubmitterSessionUser } from "@/lib/submitter-auth";
import { redirect } from "next/navigation";

export default async function PortalPage() {
    const user = await getSubmitterSessionUser();

    if (!user) {
        redirect("/login?next=/portal");
    }

    return <PortalPageClient />;
}
