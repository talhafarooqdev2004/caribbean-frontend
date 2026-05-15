import { HomeClientPage } from "@/components/feature/pages";
import { listNewestApprovedPressReleases } from "@/lib/press-releases";
import { type PressReleaseRecord } from "@/lib/press-release-types";

export default async function Home() {
  let releases: PressReleaseRecord[] = [];

  try {
    releases = await listNewestApprovedPressReleases(6);
  } catch {
    releases = [];
  }

  return <HomeClientPage latestReleases={releases} />;
};
