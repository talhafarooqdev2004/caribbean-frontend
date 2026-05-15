"use client";

import styles from "./NewsroomBookmarkButton.module.scss";

import { useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useState } from "react";

import { clearPortalBookmarkedIdsCache, getPortalBookmarkedReleaseIds } from "@/lib/portal-bookmarked-ids-cache";

type NewsroomBookmarkButtonProps = {
    releaseId: string;
};

export default function NewsroomBookmarkButton({ releaseId }: NewsroomBookmarkButtonProps) {
    const router = useRouter();
    const [saved, setSaved] = useState(false);
    const [busy, setBusy] = useState(false);

    const sync = useCallback(async () => {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("carib_token") : null;

        if (!token) {
            setSaved(false);
            return;
        }

        try {
            const ids = await getPortalBookmarkedReleaseIds();
            setSaved(ids.has(releaseId));
        } catch {
            setSaved(false);
        }
    }, [releaseId]);

    useEffect(() => {
        startTransition(() => {
            void sync();
        });
    }, [sync]);

    async function handleClick(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const token = window.localStorage.getItem("carib_token");

        if (!token) {
            router.push(`/login?next=${encodeURIComponent("/newsroom")}&bookmark=${encodeURIComponent(releaseId)}`);
            return;
        }

        setBusy(true);

        try {
            if (saved) {
                const response = await fetch(`/api/user/bookmarks/${encodeURIComponent(releaseId)}`, { method: "DELETE" });

                if (response.ok) {
                    setSaved(false);
                    clearPortalBookmarkedIdsCache();
                }
            } else {
                const response = await fetch("/api/user/bookmarks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ releaseId }),
                });

                if (response.ok) {
                    setSaved(true);
                    clearPortalBookmarkedIdsCache();
                }
            }
        } finally {
            setBusy(false);
        }
    }

    return (
        <button
            type="button"
            className={`${styles.bookmarkBtn} ${saved ? styles.bookmarkBtnActive : ""}`}
            onClick={handleClick}
            disabled={busy}
            aria-label={saved ? "Remove bookmark" : "Save bookmark"}
            title={saved ? "Remove bookmark" : "Bookmark"}
        >
            {saved ? "★" : "☆"}
        </button>
    );
}
