import { JoinTheMediaNetworkClientPage } from "@/components/feature/pages";
import { caribApiFetch, parseCaribApiJson } from "@/lib/backend-api";
import { type NetworkStatsPayload } from "@/lib/network-stats";

async function loadNetworkStats(): Promise<NetworkStatsPayload | null> {
    try {
        const response = await caribApiFetch("/network-stats");
        const payload = await parseCaribApiJson(response);

        if (!response.ok || !payload?.data || typeof payload.data !== "object") {
            return null;
        }

        return payload.data as NetworkStatsPayload;
    } catch {
        return null;
    }
}

export default async function JoinTheMediaNetwork() {
    const initialNetworkStats = await loadNetworkStats();

    return <JoinTheMediaNetworkClientPage initialNetworkStats={initialNetworkStats} />;
}
