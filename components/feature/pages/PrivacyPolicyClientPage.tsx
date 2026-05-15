"use client";

import {
  PrivacyPolicyContent,
  PrivacyPolicyHeroSection,
  PrivacyPolicyLegalCategories,
} from "@/components/composed";

export default function PrivacyPolicyClientPage() {
  return (
    <>
      <PrivacyPolicyHeroSection />
      <PrivacyPolicyLegalCategories />
      <PrivacyPolicyContent />
    </>
  );
}
