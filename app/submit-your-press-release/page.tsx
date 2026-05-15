import { SubmitYourPressReleaseClientPage } from "@/components/feature/pages";
import { getSubmitterSessionUser } from "@/lib/submitter-auth";
import { redirect } from "next/navigation";

type SubmitYourPressReleasePageProps = {
    searchParams: Promise<{
        package?: string;
    }>;
};

export default async function SubmitYourPressReleasePage({ searchParams }: SubmitYourPressReleasePageProps) {
    const user = await getSubmitterSessionUser();
    const params = await searchParams;
    const selectedPackage = params.package === "bundle" || params.package === "single" || params.package === "custom"
        ? params.package
        : null;

    if (!user) {
        const suffix = selectedPackage ? `?package=${selectedPackage}` : "";
        redirect(`/login?next=${encodeURIComponent(`/submit-your-press-release${suffix}`)}`);
    }

    return (
        <SubmitYourPressReleaseClientPage
            submitter={user}
            selectedPackage={selectedPackage}
        />
    );
}
