import LegalDocumentBody, { type LegalSection } from "./LegalDocumentBody";

const sections: LegalSection[] = [
  {
    number: "01",
    id: "information-we-collect",
    tocLabel: "Information We Collect",
    title: <>Information We <em>Collect</em></>,
    blocks: [
      { type: "subheading", text: "Information You Provide", dash: "gold" },
      { type: "list", items: ["Name", "Email address", "Organization details", "Billing information", "Media registration details", "Submitted press release content"] },
      { type: "subheading", text: "Automatically Collected Information", dash: "navy" },
      { type: "list", items: ["Device information", "Browser information", "IP address", "Usage analytics"] },
    ],
  },
  {
    number: "02",
    id: "how-we-use-it",
    tocLabel: "How We Use It",
    title: <>How We Use Your <em>Information</em></>,
    blocks: [
      { type: "lead", text: "We use information to:" },
      { type: "list", items: ["Deliver platform services", "Process payments", "Distribute press releases", "Communicate updates", "Improve platform performance", "Maintain security"] },
    ],
  },
  {
    number: "03",
    id: "public-content",
    tocLabel: "Public Content",
    title: <>Content <em>&</em> Public Information</>,
    blocks: [
      { type: "lead", text: "Press releases submitted for publication may become publicly accessible through:" },
      { type: "list", items: ["Carib Newswire", "Search engines", "Distribution partners"] },
      { type: "callout", tone: "teal", content: "Users should only submit information intended for public distribution." },
    ],
  },
  {
    number: "04",
    id: "sharing-information",
    tocLabel: "Sharing Information",
    title: <>Sharing of <em>Information</em></>,
    blocks: [
      { type: "lead", text: "We may share information with:" },
      { type: "list", items: ["Distribution partners", "Payment processors", "Service providers", "Legal authorities when required"] },
      { type: "callout", tone: "cream", icon: "shield", content: <><strong>We do not sell personal information.</strong> Your data is used solely to provide and improve our services.</> },
    ],
  },
  {
    number: "05",
    id: "cookies",
    tocLabel: "Cookies",
    title: <>Cookies <em>&</em> Tracking</>,
    blocks: [
      { type: "lead", text: "We use cookies to:" },
      { type: "list", items: ["Improve user experience", "Analyze traffic", "Maintain account sessions", "Understand platform usage"] },
      { type: "callout", tone: "teal", content: "Users may control cookies through browser settings. Disabling certain cookies may affect platform functionality." },
    ],
  },
  {
    number: "06",
    id: "data-security",
    tocLabel: "Data Security",
    title: <>Data <em>Security</em></>,
    blocks: [
      { type: "lead", text: "We implement reasonable safeguards to protect user information from unauthorized access, disclosure, or misuse." },
      { type: "callout", tone: "cream", icon: "lock", content: "While we take data security seriously, no system is entirely infallible. We encourage users to use strong passwords and secure their accounts." },
    ],
  },
  {
    number: "07",
    id: "your-rights",
    tocLabel: "Your Rights",
    title: <>Your <em>Rights</em></>,
    blocks: [
      { type: "lead", text: "Depending on applicable law, users may request:" },
      { type: "list", items: ["Access to personal data", "Correction of information", "Deletion of data", "Restriction of processing"] },
      { type: "callout", tone: "gold", content: <>Requests may be submitted via email to <a href="mailto:info@caribnewswire.com">info@caribnewswire.com</a>.</> },
    ],
  },
  {
    number: "08",
    id: "data-retention",
    tocLabel: "Data Retention",
    title: <>Data <em>Retention</em></>,
    blocks: [
      { type: "lead", text: "Information is retained as long as necessary to:" },
      { type: "list", items: ["Provide services", "Meet legal obligations", "Maintain business records"] },
    ],
  },
  {
    number: "09",
    id: "third-party-links",
    tocLabel: "Third-Party Links",
    title: <>Third-Party <em>Links</em></>,
    blocks: [
      { type: "lead", text: "Our platform may contain links to external websites. Carib Newswire is not responsible for the privacy practices of third-party sites." },
    ],
  },
  {
    number: "10",
    id: "childrens-privacy",
    tocLabel: "Children's Privacy",
    title: <>Children's <em>Privacy</em></>,
    blocks: [
      { type: "lead", text: "Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children." },
    ],
  },
  {
    number: "11",
    id: "changes",
    tocLabel: "Changes",
    title: <>Changes to This <em>Policy</em></>,
    blocks: [
      { type: "lead", text: "This policy may be updated periodically. Changes become effective upon publication on the website." },
    ],
  },
  {
    number: "12",
    id: "contact-us",
    tocLabel: "Contact Us",
    title: <>Contact <em>Us</em></>,
    blocks: [
      { type: "lead", text: "For privacy-related inquiries:" },
      { type: "callout", tone: "gold", content: <><strong>Carib Newswire</strong><br />Email: <a href="mailto:info@caribnewswire.com">info@caribnewswire.com</a></> },
    ],
  },
];

export default function PrivacyPolicyContent() {
  return <LegalDocumentBody accent="teal" sections={sections} />;
}
