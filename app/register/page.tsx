"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { armJoinMediaNetworkFormIntent, joinMediaNetworkFormHref } from "@/lib/join-media-network-form-intent";

/**
 * /register is kept for bookmarks and external links. Next.js redirects cannot
 * preserve a URL fragment, so we client-navigate to the join page with a hash
 * so the signup form can scroll into view.
 */
export default function RegisterRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        armJoinMediaNetworkFormIntent();
        router.replace(joinMediaNetworkFormHref());
    }, [router]);

    return (
        <p style={{ padding: "2rem", textAlign: "center", color: "#274060" }}>
            Taking you to sign up…
        </p>
    );
}
