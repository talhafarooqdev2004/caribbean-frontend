import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "@/styles/globals.scss";
import { MainLayout } from "@/components/layout";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Caribbean News",
    template: "%s | Caribbean News",
  },
  description: "Caribbean News",
  icons: {
    icon: [
      { url: "/images/site-favicon.jpg", type: "image/jpeg", sizes: "32x32" },
      { url: "/images/site-favicon.jpg", type: "image/jpeg", sizes: "16x16" },
      { url: "/images/site-favicon.jpg", type: "image/jpeg" },
    ],
    shortcut: "/images/site-favicon.jpg",
    apple: "/images/site-favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
