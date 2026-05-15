import { NewsRoomCLientPage } from "@/components/feature/pages";
import { listApprovedPressReleases, listNewsroomDefaultGrid } from "@/lib/press-releases";
import { type PressReleaseRecord } from "@/lib/press-release-types";

export default async function NewsRoom() {
    let initialFeaturedReleases: PressReleaseRecord[] = [];
    let initialGridReleases: PressReleaseRecord[] = [];
    let initialTotalPages = 1;

    try {
        const [featured, grid] = await Promise.all([
            listApprovedPressReleases(100),
            listNewsroomDefaultGrid(),
        ]);
        initialFeaturedReleases = featured;
        initialGridReleases = grid.releases;
        initialTotalPages = grid.totalPages;
    } catch {
        initialFeaturedReleases = [];
        initialGridReleases = [];
        initialTotalPages = 1;
    }

    return (
        <NewsRoomCLientPage
            initialFeaturedReleases={initialFeaturedReleases}
            initialGridReleases={initialGridReleases}
            initialTotalPages={initialTotalPages}
        />
    );
};
