"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import styles from "@/app/dashboard/DashboardPage.module.scss";
import { Container } from "@/components/layout";

function SubmissionSuccessInner() {
    const searchParams = useSearchParams();
    const credits = searchParams.get("credits");

    return (
        <section className={styles.dashboardSection}>
            <Container className={styles.dashboardInner}>
                <div className={styles.hero}>
                    <div>
                        <h1>✅ Submitted for review!</h1>
                        <p>
                            Your press release has been received. We will review within 48 hours and notify you by email.
                        </p>
                        {credits ? (
                            <p style={{ marginTop: 12 }}>
                                <strong>Credits remaining:</strong> {credits}
                            </p>
                        ) : null}
                    </div>
                </div>
                <div className={styles.quickActions}>
                    <Link href="/submit-your-press-release">Submit another</Link>
                    <Link href="/portal">My portal</Link>
                    <Link href="/newsroom">Browse newsroom</Link>
                </div>
            </Container>
        </section>
    );
}

export default function SubmissionSuccessfulPage() {
    return (
        <Suspense fallback={null}>
            <SubmissionSuccessInner />
        </Suspense>
    );
}
