import LegalDocumentBody, { type LegalSection } from "./LegalDocumentBody";

const sections: LegalSection[] = [
  {
    number: "01",
    id: "overview",
    tocLabel: "Overview",
    title: <>Overview</>,
    blocks: [
      { type: "lead", text: "Carib Newswire is a platform that provides press release distribution and media outreach services for organizations across the Caribbean and its global diaspora." },
      { type: "lead", text: "By accessing or using our services, you agree to comply with these Terms of Service." },
      { type: "callout", tone: "gold", content: <><strong>Important:</strong> Please read these terms carefully before using Carib Newswire. Using our platform constitutes your agreement to these terms.</> },
    ],
  },
  {
    number: "02",
    id: "eligibility",
    tocLabel: "Eligibility",
    title: <>Eligibility</>,
    blocks: [
      { type: "lead", text: "To use our services, you must:" },
      { type: "list", items: ["Be at least 18 years old", "Have authority to act on behalf of your organization", "Provide accurate and complete information", "Comply with all applicable laws and regulations"] },
    ],
  },
  {
    number: "03",
    id: "user-accounts",
    tocLabel: "User Accounts",
    title: <>User Accounts</>,
    blocks: [
      { type: "lead", text: "Users may be required to create an account to submit releases or access platform features. You are responsible for:" },
      { type: "list", items: ["Maintaining account security", "Protecting login credentials", "All activities occurring under your account"] },
    ],
  },
  {
    number: "04",
    id: "services-payments",
    tocLabel: "Services & Payments",
    title: <>Services <em>&</em> Payments</>,
    blocks: [
      { type: "subheading", text: "Distribution Services", dash: "teal" },
      { type: "lead", text: "Carib Newswire offers:" },
      { type: "list", items: ["Press release distribution", "Media outreach campaigns", "Featured placements", "Professional campaign services"] },
      { type: "subheading", text: "Payment Terms", dash: "teal" },
      { type: "list", items: ["All fees are listed in USD", "Payments are due before distribution", "Certain services may require custom proposals", "Refunds are subject to company review"] },
    ],
  },
  {
    number: "05",
    id: "content-ownership",
    tocLabel: "Content Ownership",
    title: <>Content Ownership <em>&</em> License</>,
    blocks: [
      { type: "subheading", text: "Ownership", dash: "teal" },
      { type: "lead", text: "You retain ownership of all submitted content." },
      { type: "subheading", text: "License Granted", dash: "teal" },
      { type: "lead", text: "By submitting content, you grant Carib Newswire the right to:" },
      { type: "list", items: ["Publish content", "Distribute content", "Archive content", "Display content on platform channels"] },
    ],
  },
  {
    number: "06",
    id: "content-guidelines",
    tocLabel: "Content Guidelines",
    title: <>Content Guidelines</>,
    blocks: [
      { type: "lead", text: "Submitted content must not contain:" },
      { type: "list", items: ["False or misleading information", "Defamatory statements", "Copyright infringement", "Illegal content", "Harmful or malicious materials"] },
      { type: "callout", tone: "teal", content: "Carib Newswire reserves the right to reject submissions that do not meet editorial standards." },
    ],
  },
  {
    number: "07",
    id: "political-content",
    tocLabel: "Political Content",
    title: <>Political <em>&</em> Sponsored Content</>,
    blocks: [
      { type: "lead", text: "Certain categories of political or sponsored content may require additional review before publication. Appropriate disclosure may be required where applicable." },
    ],
  },
  {
    number: "08",
    id: "no-messaging",
    tocLabel: "No Messaging",
    title: <>No User Messaging or Comments</>,
    blocks: [
      { type: "lead", text: "The platform is designed for content distribution and does not currently provide public messaging, commenting, or social interaction features." },
    ],
  },
  {
    number: "09",
    id: "disclaimer",
    tocLabel: "Disclaimer",
    title: <>Disclaimer of Warranties</>,
    blocks: [
      { type: "lead", text: "Services are provided on an “as available” and “as is” basis. Carib Newswire does not guarantee:" },
      { type: "list", items: ["Media pickup", "Publication by third-party outlets", "Specific audience reach", "Particular business outcomes"] },
    ],
  },
  {
    number: "10",
    id: "liability",
    tocLabel: "Liability",
    title: <>Limitation of Liability</>,
    blocks: [
      { type: "lead", text: "Carib Newswire shall not be liable for:" },
      { type: "list", items: ["Indirect damages", "Consequential damages", "Lost profits", "Business interruption", "Third-party actions"] },
      { type: "callout", tone: "gold", content: "Liability shall not exceed the amount paid for services in the relevant transaction." },
    ],
  },
  {
    number: "11",
    id: "indemnification",
    tocLabel: "Indemnification",
    title: <>Indemnification</>,
    blocks: [
      { type: "lead", text: "Users agree to indemnify and hold harmless Carib Newswire from claims arising from:" },
      { type: "list", items: ["Submitted content", "Violations of these terms", "Misuse of services"] },
    ],
  },
  {
    number: "12",
    id: "termination",
    tocLabel: "Termination",
    title: <>Termination</>,
    blocks: [
      { type: "lead", text: "We reserve the right to suspend or terminate access if:" },
      { type: "list", items: ["Terms are violated", "Fraudulent activity occurs", "Misuse of the platform is detected"] },
    ],
  },
  {
    number: "13",
    id: "governing-law",
    tocLabel: "Governing Law",
    title: <>Governing Law</>,
    blocks: [
      { type: "lead", text: "These terms shall be governed by applicable laws of the operating jurisdiction of Carib Newswire." },
    ],
  },
  {
    number: "14",
    id: "changes",
    tocLabel: "Changes",
    title: <>Changes to Terms</>,
    blocks: [
      { type: "lead", text: "Carib Newswire may update these terms periodically. Continued use of the platform constitutes acceptance of updated terms." },
    ],
  },
  {
    number: "15",
    id: "contact",
    tocLabel: "Contact",
    title: <>Contact Information</>,
    blocks: [
      { type: "lead", text: "For questions about these Terms of Service, please contact us:" },
      { type: "callout", tone: "gold", content: <><strong>Carib Newswire</strong><br />Email: <a href="mailto:info@caribnewswire.com">info@caribnewswire.com</a></> },
    ],
  },
];

export default function TermsOfServiceContent() {
  return <LegalDocumentBody accent="gold" sections={sections} />;
}
