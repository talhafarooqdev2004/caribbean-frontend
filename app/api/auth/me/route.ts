import { getSubmitterSessionUser } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function GET() {
    const user = await getSubmitterSessionUser();

    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({ user });
}
