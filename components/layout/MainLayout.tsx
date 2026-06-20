"use client";

import { usePathname } from "next/navigation";
import CookieConsent from "../composed/CookieConsent";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const path = usePathname();
    const isAdminRoute = path.startsWith("/admin");
    const isMaintenanceRoute = path.startsWith("/maintenance");

    if (isAdminRoute || isMaintenanceRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            {children}
            <Footer />
            <CookieConsent />
        </>
    );
};
