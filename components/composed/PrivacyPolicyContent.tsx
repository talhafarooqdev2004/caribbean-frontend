import {
  Database,
  Eye,
  FileText,
  Lock,
  Shield,
  UserRound,
  Users,
} from "lucide-react";

import LegalDocumentContent, {
  type LegalDocumentSection,
} from "./LegalDocumentContent";

const privacyPolicySections: LegalDocumentSection[] = [
  {
    id: "privacy-information-we-collect",
    number: 1,
    title: "Information We Collect",
    icon: Database,
    lead: "We may collect the following types of information:",
    cards: [
      {
        title: "a. Personal Information",
        items: [
          "Full name",
          "Email address",
          "Phone number",
          "Business or organization details",
        ],
      },
      {
        title: "b. Account & Content Information",
        items: [
          "Press releases and media submissions",
          "Event listings and related content",
          "Media contact details submitted to the platform",
        ],
      },
      {
        title: "c. Payment Information",
        items: [
          "Payment details are processed securely through third-party providers (e.g., Stripe or similar)",
          "We do not store full payment card details",
        ],
      },
      {
        title: "d. Technical Data",
        items: [
          "IP address",
          "Browser type",
          "Device information",
          "Website usage data (via analytics tools)",
        ],
      },
    ],
  },
  {
    id: "privacy-how-we-use",
    number: 2,
    title: "How We Use Your Information",
    icon: FileText,
    cards: [
      {
        content: "We use your information to:",
        items: [
          "Provide and operate the Carib Newswire platform",
          "Process purchases and service requests",
          "Distribute press releases and content submissions",
          "Communicate with you (including service updates and support)",
          "Improve platform functionality and user experience",
          "Send marketing or promotional communications (you may opt out at any time)",
        ],
      },
      {
        tone: "info",
        title: "Email Communications",
        content: (
          <>
            We may use your email address to send you updates, newsletters,
            marketing communications, and platform-related announcements. These
            communications may be managed through third-party email service
            providers such as Mailchimp.
            <br />
            <br />
            You may opt out of marketing emails at any time by clicking the
            &quot;unsubscribe&quot; link included in our emails or by contacting
            us directly.
          </>
        ),
      },
    ],
  },
  {
    id: "privacy-content-and-public-information",
    number: 3,
    title: "Content and Public Information",
    icon: Users,
    cards: [
      {
        content:
          "Any content submitted to Carib Newswire (including press releases, event listings, and media materials) may be:",
        items: [
          "Published on the platform",
          "Distributed to media contacts",
          "Shared publicly",
        ],
        footer:
          "By submitting content, you acknowledge that this information may be publicly accessible.",
      },
    ],
  },
  {
    id: "privacy-sharing-of-information",
    number: 4,
    title: "Sharing of Information",
    icon: Shield,
    cards: [
      {
        content: "We may share your information with:",
        items: [
          "Service providers (payment processors, analytics tools, email platforms like Mailchimp)",
          "Media partners and journalists (as part of content distribution)",
          "Legal authorities if required by law",
        ],
        footer: (
          <p>
            <strong>We do not sell your personal data to third parties.</strong>
          </p>
        ),
      },
    ],
  },
  {
    id: "privacy-cookies-and-tracking",
    number: 5,
    title: "Cookies and Tracking Technologies",
    icon: Eye,
    cards: [
      {
        content: (
          <>
            We use cookies and similar tracking technologies to enhance your
            experience, analyze platform usage, and improve our services. This
            may include the use of analytics tools and third-party tracking
            technologies.
            <br />
            <br />
            By using our platform, you consent to the use of cookies. You may
            adjust your browser settings to refuse cookies; however, some
            features of the platform may not function properly.
          </>
        ),
      },
    ],
  },
  {
    id: "privacy-data-security",
    number: 6,
    title: "Data Security",
    icon: Lock,
    cards: [
      {
        content:
          "We implement reasonable administrative, technical, and physical safeguards to protect your information. However, no system is 100% secure.",
      },
    ],
  },
  {
    id: "privacy-your-rights",
    number: 7,
    title: "Your Rights",
    icon: Shield,
    cards: [
      {
        content: "Depending on your location, you may have the right to:",
        items: [
          "Access your personal data",
          "Request corrections or deletion",
          "Opt out of marketing communications",
        ],
        footer: (
          <>
            To make a request, contact us at:{" "}
            <a href="mailto:info@caribnewswire.com">info@caribnewswire.com</a>
          </>
        ),
      },
    ],
  },
  {
    id: "privacy-data-retention",
    number: 8,
    title: "Data Retention",
    icon: Database,
    cards: [
      {
        content: "We retain your information as long as necessary to:",
        items: [
          "Provide services",
          "Comply with legal obligations",
          "Resolve disputes",
        ],
      },
    ],
  },
  {
    id: "privacy-third-party-links",
    number: 9,
    title: "Third-Party Links",
    icon: Eye,
    cards: [
      {
        content:
          "Our platform may contain links to third-party websites. We are not responsible for their privacy practices.",
      },
    ],
  },
  {
    id: "privacy-childrens-privacy",
    number: 10,
    title: "Children's Privacy",
    icon: UserRound,
    cards: [
      {
        content:
          "Carib Newswire is intended for users 18 years and older. We do not knowingly collect data from minors.",
      },
    ],
  },
  {
    id: "privacy-changes-to-policy",
    number: 11,
    title: "Changes to This Policy",
    icon: FileText,
    cards: [
      {
        content:
          "We may update this Privacy Policy at any time. Updates will be posted on this page with a revised effective date.",
      },
    ],
  },
  {
    id: "privacy-contact-us",
    number: 12,
    title: "Contact Us",
    icon: Shield,
    inlineTitleCard: true,
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

export default function PrivacyPolicyContent() {
  return (
    <LegalDocumentContent
      intro={
        <p>
          Carib Newswire, operated by{" "}
          <strong>Bayfront Innovation Group LLC</strong> (&quot;Company,&quot;
          &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), respects your
          privacy and is committed to protecting your personal information. This
          Privacy Policy explains how we collect, use, and safeguard your
          information when you use our platform.
        </p>
      }
      sections={privacyPolicySections}
    />
  );
}
