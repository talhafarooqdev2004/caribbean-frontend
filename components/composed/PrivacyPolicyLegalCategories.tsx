import { Database, Eye, FileText, Shield, Users, Lock } from "lucide-react";

import LegalDocumentCategories, {
  type LegalDocumentCategory,
} from "./LegalDocumentCategories";

const privacyPolicyCategories: LegalDocumentCategory[] = [
  {
    id: "privacy-information-we-collect",
    label: "Information We Collect",
    icon: Database,
  },
  {
    id: "privacy-how-we-use",
    label: "How We Use Your Information",
    icon: FileText,
  },
  {
    id: "privacy-content-and-public-information",
    label: "Content and Public Information",
    icon: Users,
  },
  {
    id: "privacy-sharing-of-information",
    label: "Sharing of Information",
    icon: Shield,
  },
  {
    id: "privacy-cookies-and-tracking",
    label: "Cookies and Tracking Technologies",
    icon: Eye,
  },
  { id: "privacy-data-security", label: "Data Security", icon: Lock },
];

export default function PrivacyPolicyLegalCategories() {
  return <LegalDocumentCategories categories={privacyPolicyCategories} />;
}
