import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import { MainLayout } from "@/components/layout";

const inter = Inter({
  variable: '--font-inter',
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Caribbean News",
    template: "%s | Caribbean News",
  },
  description: "Caribbean News",
  icons: {
    icon: "/images/brand-logo.svg",
    shortcut: "/images/brand-logo.svg",
    apple: "/images/brand-logo-white.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
