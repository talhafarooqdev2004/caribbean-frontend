import { ensureEnquiryIndexes } from "@/lib/enquiry-indexes";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
    const start = Date.now();
    let dbReady = false;

    try {
        const db = await getDb();
        await db.command({ ping: 1 });
        await ensureEnquiryIndexes();
        dbReady = true;
    } catch (error) {
        console.error("Keep-warm ping failed to warm dependencies.", error);
    }

    return Response.json(
        {
            status: "ok",
            dbReady,
            warmedAt: new Date().toISOString(),
            durationMs: Date.now() - start,
        },
        {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        }
    );
}