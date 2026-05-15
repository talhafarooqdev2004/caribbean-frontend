import { cookies } from "next/headers";

import { SUBMITTER_SESSION_COOKIE } from "@/lib/submitter-auth";

export const runtime = "nodejs";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete(SUBMITTER_SESSION_COOKIE);

    return Response.json({ message: "Signed out successfully." });
}
