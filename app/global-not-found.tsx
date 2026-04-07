import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";

import "@/styles/globals.scss";

const inter = Inter({
    variable: "--font-inter",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Page Not Available",
    description: "This area is temporarily unavailable.",
};

export default function GlobalNotFound() {
    return (
        <html lang="en" className={inter.variable}>
            <body>
                <main className="global-not-found">
                    <div className="card">
                        <h1>Page not available right now</h1>
                    </div>
                </main>

                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    body {
                        min-height: 100vh;
                        background:
                            radial-gradient(circle at top left, rgba(88, 153, 226, 0.18), transparent 28%),
                            radial-gradient(circle at bottom right, rgba(255, 196, 0, 0.12), transparent 24%),
                            linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);
                    }

                    .global-not-found {
                        min-height: 100vh;
                        display: grid;
                        place-items: center;
                        padding: 24px;
                    }

                    .card {
                        width: min(100%, 720px);
                        border: 1px solid rgba(88, 153, 226, 0.18);
                        border-radius: 28px;
                        background: rgba(255, 255, 255, 0.94);
                        box-shadow: 0 24px 60px rgba(39, 64, 96, 0.12);
                        padding: clamp(28px, 5vw, 56px);
                    }

                    .eyebrow {
                        margin: 0 0 14px;
                        color: #0e3b66;
                        font-size: 0.8rem;
                        font-weight: 700;
                        letter-spacing: 0.12em;
                        text-transform: uppercase;
                    }

                    h1 {
                        margin: 0;
                        color: #0f172a;
                        font-size: clamp(2rem, 5vw, 3.25rem);
                        line-height: 1.05;
                    }

                    .lead {
                        margin: 18px 0 0;
                        max-width: 58ch;
                        font-size: 1.05rem;
                    }

                    .actions {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 14px;
                        margin-top: 30px;
                    }

                    .button {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 48px;
                        padding: 0 18px;
                        border-radius: 999px;
                        font-weight: 700;
                        text-decoration: none;
                        transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
                    }

                    .button:hover {
                        transform: translateY(-1px);
                    }

                    .primary {
                        background: #0e3b66;
                        color: #fff;
                        box-shadow: 0 14px 28px rgba(14, 59, 102, 0.2);
                    }

                    .secondary {
                        border: 1px solid rgba(14, 59, 102, 0.22);
                        background: #fff;
                        color: #0e3b66;
                    }

                    @media (max-width: 520px) {
                        .actions {
                            flex-direction: column;
                        }

                        .button {
                            width: 100%;
                        }
                    }
                `,
                    }}
                />
            </body>
        </html>
    );
}
