import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import { Footer, Header } from "@/components/layout";

const inter = Inter({
  variable: '--font-inter',
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Caribbean News",
  description: "Caribbean News",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
