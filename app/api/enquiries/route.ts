import { getAdminAuthorizationHeader } from "@/lib/admin-auth";
import { listEnquiries } from "@/lib/enquiries";

export const runtime = "nodejs";

export async function GET() {
    try {
        if (!(await getAdminAuthorizationHeader())) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const enquiries = await listEnquiries();

        return Response.json({ enquiries });
    } catch {
        return Response.json({ error: "We could not load enquiries right now." }, { status: 503 });
    }
}
