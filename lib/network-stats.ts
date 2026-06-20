export type NetworkStatsPayload = {
    mediaMembers?: number;
    mediaMembersLabel?: string;
    islandsCovered?: number;
    islandsCoveredLabel?: string;
    releasesSent?: number;
    releasesSentLabel?: string;
    distributionRate?: number;
    distributionRateLabel?: string;
    lastReleaseAt?: string | null;
    lastReleaseLabel?: string | null;
    updatedAt?: string;
};

export type NetworkStatsDisplay = {
    mediaMembersLabel: string;
    islandsCoveredLabel: string;
    releasesSentLabel: string;
    distributionRateLabel: string;
    lastReleaseLabel: string | null;
};

export const NETWORK_STATS_FALLBACK: NetworkStatsDisplay = {
    mediaMembersLabel: "500+",
    islandsCoveredLabel: "15+",
    releasesSentLabel: "1.2k+",
    distributionRateLabel: "98%",
    lastReleaseLabel: null,
};

export function isEmptyNetworkStats(payload: NetworkStatsPayload | null | undefined) {
    if (!payload) {
        return true;
    }

    const mediaMembers = payload.mediaMembers ?? 0;
    const releasesSent = payload.releasesSent ?? 0;

    return mediaMembers <= 0 && releasesSent <= 0;
}

export function resolveNetworkStatsDisplay(payload: NetworkStatsPayload | null | undefined): NetworkStatsDisplay {
    if (isEmptyNetworkStats(payload)) {
        return NETWORK_STATS_FALLBACK;
    }

    return {
        mediaMembersLabel: payload?.mediaMembersLabel?.trim() || NETWORK_STATS_FALLBACK.mediaMembersLabel,
        islandsCoveredLabel: payload?.islandsCoveredLabel?.trim() || NETWORK_STATS_FALLBACK.islandsCoveredLabel,
        releasesSentLabel: payload?.releasesSentLabel?.trim() || NETWORK_STATS_FALLBACK.releasesSentLabel,
        distributionRateLabel: payload?.distributionRateLabel?.trim() || NETWORK_STATS_FALLBACK.distributionRateLabel,
        lastReleaseLabel: payload?.lastReleaseLabel ?? null,
    };
}

export function usesNetworkStatsFallback(payload: NetworkStatsPayload | null | undefined) {
    return isEmptyNetworkStats(payload);
}
