import { type NextRequest } from "next/server";

import { handleSiteAccessMaintenanceRequest } from "@/lib/site-access-maintenance-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    return handleSiteAccessMaintenanceRequest(request, "off");
}

export async function GET(request: NextRequest) {
    return handleSiteAccessMaintenanceRequest(request, "off");
}
