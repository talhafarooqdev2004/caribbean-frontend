import { Ban, CircleAlert, FileText, Scale, Shield, Users } from "lucide-react";

import LegalDocumentContent, {
  type LegalDocumentSection,
} from "./LegalDocumentContent";

const termsSections: LegalDocumentSection[] = [
  {
    id: "terms-overview",
    number: 1,
    title: "Overview",
    icon: FileText,
    cards: [
      {
        content: (
          <>
            Carib Newswire is a media distribution and content platform operated
            by <strong>Bayfront Innovation Group LLC.</strong> Our services
            include press release distribution, media exposure, and related
            communications services.
          </>
        ),
      },
    ],
  },
  {
    id: "terms-eligibility",
    number: 2,
    title: "Eligibility",
    icon: Users,
    cards: [
      {
        content: (
          <>
            You must be at least <strong>18 years old</strong> to use this
            platform.
          </>
        ),
      },
    ],
  },
  {
    id: "terms-user-accounts",
    number: 3,
    title: "User Accounts",
    icon: Users,
    cards: [
      {
        items: [
          "You are responsible for maintaining the confidentiality of your account",
          "You agree to provide accurate and complete information",
          "We reserve the right to suspend or terminate accounts at our discretion",
        ],
      },
    ],
  },
  {
    id: "terms-services-payments",
    number: 4,
    title: "Services and Payments",
    icon: FileText,
    cards: [
      {
        items: [
          "Carib Newswire operates on a one-time purchase model (with custom pricing available via proposal)",
          "All payments are final unless otherwise stated",
          "We reserve the right to modify pricing at any time",
        ],
      },
    ],
  },
  {
    id: "terms-content-ownership",
    number: 5,
    title: "Content Ownership and License",
    icon: Users,
    cards: [
      {
        title: "Ownership",
        content: "You retain ownership of all content you submit.",
      },
      {
        title: "License to Us",
        content:
          "By submitting content, you grant Carib Newswire a non-exclusive, worldwide, royalty-free license to:",
        items: ["Publish", "Distribute", "Reproduce", "Promote"],
        footer: "your content across our platform and media channels.",
      },
    ],
  },
  {
    id: "terms-content-guidelines",
    number: 6,
    title: "Content Guidelines",
    icon: Shield,
    cards: [
      {
        content: "You agree not to submit content that:",
        items: [
          "Is false, misleading, or defamatory",
          "Violates any laws or regulations",
          "Infringes on intellectual property rights",
          "Contains harmful, abusive, or unlawful material",
        ],
        footer:
          "We reserve the right to remove or reject content at our discretion.",
      },
    ],
  },
  {
    id: "terms-political-sponsored-content",
    number: 7,
    title: "Political and Sponsored Content",
    icon: Shield,
    cards: [
      {
        content: "Carib Newswire may accept:",
        items: ["Political content", "Sponsored or promotional content"],
        footer:
          "We do not guarantee endorsement or verification of such content.",
      },
    ],
  },
  {
    id: "terms-no-user-messaging",
    number: 8,
    title: "No User Messaging or Comments",
    icon: Ban,
    cards: [
      {
        content: "At this time:",
        items: [
          "The platform does not support user-to-user messaging",
          "Public commenting features are not enabled",
        ],
      },
    ],
  },
  {
    id: "terms-disclaimer-warranties",
    number: 9,
    title: "Disclaimer of Warranties",
    icon: CircleAlert,
    cards: [
      {
        tone: "warning",
        content: (
          <>
            Carib Newswire provides services <strong>&quot;as is&quot;</strong>{" "}
            without warranties of any kind.
            <br />
            <br />
            We do not guarantee:
          </>
        ),
        items: [
          "Media pickup or coverage",
          "Specific performance outcomes",
          "Uninterrupted platform access",
        ],
      },
    ],
  },
  {
    id: "terms-limitation-liability",
    number: 10,
    title: "Limitation of Liability",
    icon: CircleAlert,
    cards: [
      {
        tone: "danger",
        content:
          "To the fullest extent permitted by law, Bayfront Innovation Group LLC shall not be liable for:",
        items: [
          "Indirect or consequential damages",
          "Loss of revenue, data, or business opportunities",
          "Content submitted by users",
        ],
      },
    ],
  },
  {
    id: "terms-indemnification",
    number: 11,
    title: "Indemnification",
    icon: Shield,
    cards: [
      {
        content:
          "You agree to indemnify and hold harmless Carib Newswire from any claims arising from:",
        items: [
          "Your content",
          "Your use of the platform",
          "Your violation of these terms",
        ],
      },
    ],
  },
  {
    id: "terms-termination",
    number: 12,
    title: "Termination",
    icon: Ban,
    cards: [
      {
        content:
          "We may suspend or terminate your access at any time for violations of these terms.",
      },
    ],
  },
  {
    id: "terms-governing-law",
    number: 13,
    title: "Governing Law",
    icon: Scale,
    cards: [
      {
        content: (
          <>
            These Terms are governed by the laws of the{" "}
            <strong>United States Virgin Islands.</strong>
          </>
        ),
      },
    ],
  },
  {
    id: "terms-changes-to-terms",
    number: 14,
    title: "Changes to Terms",
    icon: FileText,
    cards: [
      {
        content:
          "We may update these Terms at any time. Continued use of the platform constitutes acceptance of those changes.",
      },
    ],
  },
  {
    id: "terms-contact-information",
    number: 15,
    title: "Contact Information",
    icon: Shield,
    cards: [
      {
        tone: "info",
        content: (
          <div>
            <strong>Bayfront Innovation Group LLC</strong>
            <div style={{ marginTop: "10px" }} />
            Carib Newswire
            <br />
            P.O. Box 2327
            <br />
            Kingshill, VI 00851-2327
            <br />
            St. Croix, United States Virgin Islands
            <div />
            <div style={{ marginTop: "10px" }}>
              Email:{" "}
              <a href="mailto:info@caribnewswire.com">info@caribnewswire.com</a>
            </div>
          </div>
        ),
      },
    ],
  },
];

export default function TermsOfServiceContent() {
  return (
    <LegalDocumentContent
      intro="Welcome to Carib Newswire. By accessing or using our platform, you agree to the following Terms of Service."
      sections={termsSections}
    />
  );
}
