"use client";

import { CircleAlert, FileText, Scale, Shield, Users } from "lucide-react";

import LegalDocumentCategories, { type LegalDocumentCategory } from "./LegalDocumentCategories";

const legalCategories: LegalDocumentCategory[] = [
    { id: "terms-services-payments", label: "Services & Payments", icon: FileText },
    { id: "terms-content-ownership", label: "Content Ownership", icon: Users },
    { id: "terms-content-guidelines", label: "Content Guidelines", icon: Shield },
    { id: "terms-disclaimer-warranties", label: "Warranties & Liability", icon: CircleAlert },
    { id: "terms-governing-law", label: "Legal Terms", icon: Scale },
];

export default function TermsOfServiceLegalCategories() {
    return <LegalDocumentCategories categories={legalCategories} />;
}
