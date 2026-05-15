"use client";

import styles from "./PortalPage.module.scss";
import PortalPageSkeleton from "./PortalPageSkeleton";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout";
import { Button, FormControl, FormLabel, Input, News, Textarea } from "@/components/ui";
import SvgIcon from "@/components/ui/SvgIcon";
import { type PressReleaseRecord } from "@/lib/press-release-types";
import {
    formatReleaseDate,
    formatReleaseTime,
    getReleaseImageSrc,
    getReleaseUrl,
} from "@/lib/press-release-display";
import { releaseCardExcerpt, stripTagsToPlainText } from "@/lib/press-release-list-excerpt";
import { clearPortalBookmarkedIdsCache } from "@/lib/portal-bookmarked-ids-cache";

type TabId = "submissions" | "credits" | "saved" | "settings";

type PortalProfile = {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    mediaOutlet: string;
    location: string;
    primaryBeat: string;
    bio: string;
    digestOptedIn: boolean;
    organization: string | null;
    phone: string | null;
    credits: number;
    bundleCreditsRemaining?: number;
    permanentCredits?: number;
    creditsExpiresAt: string | null;
    bundleCreditsExpiresAt?: string | null;
    packageType: string | null;
    memberSince: string;
};

type CreditsPayload = {
    credits: number;
    bundleCreditsRemaining?: number;
    permanentCredits?: number;
    packageType: string | null;
    creditsExpiresAt: string | null;
    bundleCreditsExpiresAt?: string | null;
    packageCapacity: number | null;
    creditsUsedInPackage: number | null;
};

function formatDisplayDate(value: string | null) {
    if (!value) {
        return "No expiry";
    }

    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

type SubmissionStatusIcon =
    | "portal-status-live"
    | "portal-status-awaiting-payment"
    | "portal-status-under-review"
    | "portal-status-rejected";

function isSettingsNoticeError(message: string) {
    return message.startsWith("Could not") || message.toLowerCase().includes("invalid");
}

function SettingsNoticeBar({ message, onDismiss }: { message: string; onDismiss: () => void }) {
    const err = isSettingsNoticeError(message);
    return (
        <div
            className={`${styles.settingsNotice} ${err ? styles.settingsNoticeError : styles.settingsNoticeSuccess}`}
            role="status"
            aria-live="polite"
        >
            <div className={styles.settingsNoticeInner}>
                <div className={styles.settingsNoticeRow}>
                    <span className={styles.settingsNoticeIcon} aria-hidden>
                        {err ? <SvgIcon icon="portal-status-rejected" /> : <SvgIcon icon="portal-status-live" />}
                    </span>
                    <span className={styles.settingsNoticeText}>{message}</span>
                </div>
                <button
                    type="button"
                    className={styles.settingsNoticeDismiss}
                    onClick={onDismiss}
                    aria-label="Dismiss notification"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

function submissionStatus(release: PressReleaseRecord): { label: string; icon: SubmissionStatusIcon } {
    if (release.paymentStatus !== "paid") {
        return { label: "Awaiting payment", icon: "portal-status-awaiting-payment" };
    }
    if (release.status === "approved") {
        return { label: "Live", icon: "portal-status-live" };
    }
    if (release.status === "rejected") {
        return { label: "Rejected", icon: "portal-status-rejected" };
    }
    return { label: "Under review", icon: "portal-status-under-review" };
}

export default function PortalPageClient() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>("submissions");
    const [profile, setProfile] = useState<PortalProfile | null>(null);
    const [creditsPayload, setCreditsPayload] = useState<CreditsPayload | null>(null);
    const [submissions, setSubmissions] = useState<PressReleaseRecord[]>([]);
    const [bookmarks, setBookmarks] = useState<PressReleaseRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [digestMessage, setDigestMessage] = useState<string | null>(null);
    const [profileMessage, setProfileMessage] = useState<string | null>(null);
    const [primaryBeatInput, setPrimaryBeatInput] = useState("");
    const [bioInput, setBioInput] = useState("");
    /** Dismisses stale portal loads (e.g. React Strict Mode remount) without `fetch(..., signal)` aborts that show as "(canceled)" in DevTools. */
    const portalLoadSessionRef = useRef(0);

    const loadAll = useCallback(async () => {
        const session = ++portalLoadSessionRef.current;
        const isCurrentLoad = () => portalLoadSessionRef.current === session;

        setLoading(true);
        try {
            const response = await fetch("/api/user/portal-overview", {
                cache: "no-store",
                credentials: "include",
            });

            if (!isCurrentLoad()) {
                return;
            }

            if (response.status === 401) {
                router.replace("/login?next=/portal");
                return;
            }

            const bundle = await response.json().catch(() => null);

            if (!isCurrentLoad()) {
                return;
            }

            const prof = bundle?.profile as PortalProfile | undefined;

            setProfile(prof ?? null);

            if (prof) {
                setPrimaryBeatInput(prof.primaryBeat ?? "");
                setBioInput(prof.bio ?? "");
            }

            const cJson = bundle?.credits as CreditsPayload | null | undefined;

            setCreditsPayload((cJson ?? null) as CreditsPayload | null);

            setSubmissions(Array.isArray(bundle?.submissions) ? bundle.submissions : []);
            setBookmarks(Array.isArray(bundle?.bookmarks) ? bundle.bookmarks : []);
            clearPortalBookmarkedIdsCache();
        } catch (error) {
            if (!isCurrentLoad()) {
                return;
            }

            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }
        } finally {
            if (isCurrentLoad()) {
                setLoading(false);
            }
        }
    }, [router]);

    useEffect(() => {
        void loadAll();
        return () => {
            portalLoadSessionRef.current += 1;
        };
    }, [loadAll]);

    useEffect(() => {
        if (!digestMessage || isSettingsNoticeError(digestMessage)) {
            return;
        }
        const id = window.setTimeout(() => setDigestMessage(null), 3000);
        return () => window.clearTimeout(id);
    }, [digestMessage]);

    useEffect(() => {
        if (!profileMessage || isSettingsNoticeError(profileMessage)) {
            return;
        }
        const id = window.setTimeout(() => setProfileMessage(null), 3000);
        return () => window.clearTimeout(id);
    }, [profileMessage]);

    const credits = creditsPayload?.credits ?? profile?.credits ?? 0;
    const hasUsableCredits = credits > 0;

    async function saveDigestOptIn(digestOptedIn: boolean) {
        setDigestMessage(null);
        const response = await fetch("/api/user/digest-settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ digestOptedIn }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
            setDigestMessage(typeof payload?.error === "string" ? payload.error : "Could not update digest subscription.");
            return;
        }

        if (payload?.profile) {
            setProfile(payload.profile as PortalProfile);
        }

        setDigestMessage(digestOptedIn ? "You are subscribed to the digest." : "You are unsubscribed from the digest.");
    }

    async function saveProfile() {
        setProfileMessage(null);
        const response = await fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ primaryBeat: primaryBeatInput, bio: bioInput }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
            setProfileMessage(typeof payload?.error === "string" ? payload.error : "Could not save profile.");
            return;
        }

        if (payload?.profile) {
            setProfile(payload.profile as PortalProfile);
        }

        setProfileMessage("Profile saved.");
    }

    async function removeBookmark(id: string) {
        const response = await fetch(`/api/user/bookmarks/${encodeURIComponent(id)}`, { method: "DELETE" });
        if (response.ok) {
            setBookmarks((current) => current.filter((release) => release.id !== id));
            clearPortalBookmarkedIdsCache();
        }
    }

    if (loading && !profile) {
        return <PortalPageSkeleton />;
    }

    if (!profile) {
        return null;
    }

    return (
        <section className={styles.section}>
            <Container className={styles.inner}>
                <div className={styles.hero}>
                    <div>
                        <h1>Hi, {profile.firstName}</h1>
                        <p>Manage submissions, credits, saved releases, and your profile in one place.</p>
                        <div className={styles.quickNav}>
                            <Button size="md" onClick={() => router.push("/submit-your-press-release")}>
                                Submit your release
                            </Button>
                            <Button size="md" variant="secondary" onClick={() => router.push("/newsroom")}>
                                View public newsroom
                            </Button>
                            <Button size="md" variant="secondary" onClick={() => router.push("/pricing")}>
                                View pricing
                            </Button>
                            <Button size="md" variant="secondary" onClick={() => router.push("/")}>
                                Back to homepage
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={styles.tabs} role="tablist" aria-label="Portal sections">
                    {(
                        [
                            ["submissions", "My submissions"],
                            ["credits", "My credits"],
                            ["saved", "Saved releases"],
                            ["settings", "Settings"],
                        ] as const
                    ).map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === id}
                            className={`${styles.tab} ${activeTab === id ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {activeTab === "submissions" ? (
                    <div className={styles.panel}>
                        {submissions.length === 0 ? (
                            <>
                                <p className={styles.empty}>No press releases submitted yet.</p>
                                <div className={styles.actions}>
                                    <Button size="md" onClick={() => router.push("/submit-your-press-release")}>
                                        Submit your first release
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Featured</th>
                                            <th>Views</th>
                                            <th>Clicks</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map((release) => {
                                            const st = submissionStatus(release);
                                            return (
                                                <tr key={release.id}>
                                                    <td>
                                                        {release.status === "approved" && release.slug ? (
                                                            <Link href={getReleaseUrl(release)}>{stripTagsToPlainText(release.title)}</Link>
                                                        ) : (
                                                            stripTagsToPlainText(release.title)
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={styles.submissionStatusCell}>
                                                            <span className={styles.submissionStatusIcon} aria-hidden>
                                                                <SvgIcon icon={st.icon} />
                                                            </span>
                                                            <span className={styles.submissionStatusLabel}>{st.label}</span>
                                                        </span>
                                                    </td>
                                                    <td className={styles.featuredCell}>
                                                        {release.featured ? (
                                                            <span
                                                                className={styles.featuredStar}
                                                                title="Featured"
                                                                aria-label="Featured"
                                                            >
                                                                <SvgIcon icon="star" />
                                                            </span>
                                                        ) : (
                                                            <span className={styles.featuredEmpty}>—</span>
                                                        )}
                                                    </td>
                                                    <td>{release.views}</td>
                                                    <td>{release.clicks}</td>
                                                    <td>{formatDisplayDate(release.createdAt)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : null}

                {activeTab === "credits" ? (
                    <div className={styles.panel}>
                        {hasUsableCredits ? (
                            <div className={styles.creditCard}>
                                <p className={styles.creditsBalance}>
                                    {credits} credit{credits === 1 ? "" : "s"} left
                                </p>
                                <div className={styles.actions}>
                                    <Button size="md" onClick={() => router.push("/submit-your-press-release")}>
                                        Submit a release
                                    </Button>
                                    <Button size="md" variant="secondary" onClick={() => router.push("/pricing")}>
                                        View pricing plans
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.creditCard}>
                                <h2 className={styles.creditsPackageTitle}>No credits remaining</h2>
                                <p className={styles.creditsEmptyCopy}>
                                    Purchase a package to submit press releases to Caribbean media.
                                </p>
                                <div className={styles.actions}>
                                    <Button size="md" onClick={() => router.push("/pricing")}>
                                        View pricing plans
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}

                {activeTab === "saved" ? (
                    <div className={styles.panel}>
                        {bookmarks.length === 0 ? (
                            <>
                                <p className={styles.empty}>
                                    No saved releases yet. Browse the newsroom and bookmark stories that interest you.
                                </p>
                                <div className={styles.actions}>
                                    <Button size="md" variant="secondary" onClick={() => router.push("/newsroom")}>
                                        Browse public newsroom
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className={styles.bookmarkGrid}>
                                {bookmarks.map((release) => (
                                    <div key={release.id} className={styles.cardWrap}>
                                        <button
                                            type="button"
                                            className={styles.bookmarkRemove}
                                            aria-label="Remove bookmark"
                                            onClick={() => void removeBookmark(release.id)}
                                        >
                                            ×
                                        </button>
                                        <News variant="portal-bookmark">
                                            <News.Header>
                                                <News.Image imgSrc={getReleaseImageSrc(release)} />
                                            </News.Header>
                                            <News.Body>
                                                <News.Meta>
                                                    <News.Territory>{release.island || "Regional"}</News.Territory>
                                                    <News.Seprator type="line-seprator" />
                                                    <News.Date>{formatReleaseDate(release.publishedAt || release.createdAt)}</News.Date>
                                                    <News.Seprator />
                                                    <News.Time>{formatReleaseTime(release.publishedAt || release.createdAt)}</News.Time>
                                                </News.Meta>
                                                <News.Title>{stripTagsToPlainText(release.title)}</News.Title>
                                                <News.Description>{releaseCardExcerpt(release)}</News.Description>
                                                <News.TagsList>
                                                    <News.Tag>{release.category}</News.Tag>
                                                    {release.featured ? <News.Tag>Featured</News.Tag> : null}
                                                </News.TagsList>
                                                <News.ReadLink link={getReleaseUrl(release)} releaseId={release.id} />
                                            </News.Body>
                                        </News>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}

                {activeTab === "settings" ? (
                    <div className={styles.panel}>
                        <div className={styles.digestSection}>
                            <div className={styles.digestCard}>
                                <h2 className={styles.digestTitle}>Email digest</h2>
                                {digestMessage ? (
                                    <SettingsNoticeBar message={digestMessage} onDismiss={() => setDigestMessage(null)} />
                                ) : null}
                                {profile.digestOptedIn ? (
                                    <>
                                        <p className={styles.digestBody}>
                                            You will receive curated Caribbean press releases and newsroom updates based on
                                            the platform digest schedule.
                                        </p>
                                        <div className={styles.actions}>
                                            <Button
                                                size="md"
                                                variant="outline-black"
                                                onClick={() => void saveDigestOptIn(false)}
                                            >
                                                Unsubscribe
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className={styles.digestLead}>Get Caribbean news stories delivered to your inbox.</p>
                                        <p className={styles.digestDescription}>
                                            Subscribe to receive curated press release headlines, summaries, and links to full
                                            releases.
                                        </p>
                                        <div className={styles.actions}>
                                            <Button size="md" onClick={() => void saveDigestOptIn(true)}>
                                                Subscribe to Digest
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles.profileSection}>
                            <h2 className={styles.profileTitle}>My profile</h2>
                            <p className={styles.profileIntro}>
                                Your account details are on file with Carib Newswire. You can refresh how editors see you
                                using the fields below.
                            </p>

                            <div className={styles.profileReadOnlyCard}>
                                <h3 className={styles.profileCardHeading}>Account details</h3>
                                <dl className={styles.profileDl}>
                                    <div className={styles.profileRow}>
                                        <dt>Name</dt>
                                        <dd>{profile.fullName}</dd>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <dt>Email</dt>
                                        <dd>{profile.email}</dd>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <dt>Organization</dt>
                                        <dd>{profile.organization || "—"}</dd>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <dt>Phone</dt>
                                        <dd>{profile.phone || "—"}</dd>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <dt>Media outlet</dt>
                                        <dd>{profile.mediaOutlet || "—"}</dd>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <dt>Location</dt>
                                        <dd>{profile.location || "—"}</dd>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <dt>Member since</dt>
                                        <dd>{formatDisplayDate(profile.memberSince)}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className={styles.profileEditCard}>
                                <div className={styles.profileFields}>
                                    <FormControl>
                                        <FormLabel htmlFor="portal-primary-beat">Primary beat / category</FormLabel>
                                        <Input
                                            id="portal-primary-beat"
                                            value={primaryBeatInput}
                                            onChange={(event) => setPrimaryBeatInput(event.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="portal-bio">Brief bio</FormLabel>
                                        <Textarea
                                            id="portal-bio"
                                            value={bioInput}
                                            onChange={(event) => setBioInput(event.target.value)}
                                            rows={5}
                                        />
                                    </FormControl>
                                </div>
                                <div className={styles.profileSaveRow}>
                                    <Button size="md" onClick={() => void saveProfile()}>
                                        Save profile
                                    </Button>
                                </div>
                                {profileMessage ? (
                                    <SettingsNoticeBar
                                        message={profileMessage}
                                        onDismiss={() => setProfileMessage(null)}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                ) : null}
            </Container>
        </section>
    );
}
