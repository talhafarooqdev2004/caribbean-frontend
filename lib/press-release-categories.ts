/** Same list as the public submit-your-press-release form. */
export const PRESS_RELEASE_CATEGORIES = [
    "Business",
    "Culture",
    "Education",
    "Environment",
    "Government",
    "Healthcare",
    "Technology",
    "Tourism",
] as const;

export type PressReleaseCategory = (typeof PRESS_RELEASE_CATEGORIES)[number];
