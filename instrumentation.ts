import { ensureEnquiryIndexes } from "@/lib/enquiry-indexes";

export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") {
        return;
    }

    try {
        await ensureEnquiryIndexes();
    } catch (error) {
        console.error("Failed to initialize enquiry indexes during startup.", error);
    }
}
