"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthPageShell from "@/components/auth/AuthPageShell";
import { armJoinMediaNetworkFormIntent, joinMediaNetworkFormHref } from "@/lib/join-media-network-form-intent";

import styles from "./RegisterRedirect.module.scss";

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
        <AuthPageShell
            badge="Join"
            title={<>Create Your <span>Account</span></>}
            subtitle="Taking you to sign up…"
        >
            <p className={styles.message} role="status" aria-live="polite">
                Redirecting to the registration form.
            </p>
        </AuthPageShell>
    );
}
