"use client";

import styles from "./SubmitYourPressReleaseForm.module.scss";

import { Check, ImageUp, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { formatReleaseDate, formatReleaseTime } from "@/lib/press-release-display";
import { stripTagsToPlainText, truncatePlainExcerpt } from "@/lib/press-release-list-excerpt";

import { Container } from "../layout";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  News,
  SvgIcon,
  Textarea,
} from "../ui";

type PackageId = "single" | "bundle" | "custom";

type SubmitYourPressReleaseValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  organization: string;
  releaseTitle: string;
  category: string;
  preferredDistributionDate: string;
  pressReleaseContent: string;
  targetRegions: string;
  specialInstructions: string;
  outboundLink: string;
};

type SubmitYourPressReleaseErrors = Partial<
  Record<
    | "fullName"
    | "email"
    | "organization"
    | "releaseTitle"
    | "category"
    | "pressReleaseContent"
    | "outboundLink"
    | "coverPhoto"
    | "document",
    string
  >
>;

type PackageOption = {
  id: PackageId;
  title: string;
  subtitle: string;
  price: number | null;
  includedItems: string[];
  ctaLabel: string;
};

const packageOptions: PackageOption[] = [
  {
    id: "single",
    title: "Single Release",
    subtitle: "$149",
    price: 149,
    ctaLabel: "Continue to Payment",
    includedItems: [
      "Up to 700 words",
      "1 cover image",
      "1 outbound link",
      "Targeted journalist distribution",
      "Newsroom publication",
      "48-hour editorial review",
    ],
  },
  {
    id: "bundle",
    title: "3-Release Package",
    subtitle: "$399",
    price: 399,
    ctaLabel: "Continue to Payment",
    includedItems: [
      "Everything in Single Release",
      "3 total release credits",
      "Flexible scheduling",
      "Use across multiple campaigns",
      "Credit validity for 6 months",
    ],
  },
  {
    id: "custom",
    title: "Professional Campaigns",
    subtitle: "From $999",
    price: null,
    ctaLabel: "Request a Proposal",
    includedItems: [
      "Multi-release campaign distribution",
      "Custom island & diaspora targeting",
      "Coordinated scheduling",
      "Campaign performance summary",
      "Dedicated support",
    ],
  },
];

const categories = [
  "Business",
  "Culture",
  "Education",
  "Environment",
  "Government",
  "Healthcare",
  "Technology",
  "Tourism",
];

/** Same destination as pricing "Professional Campaigns" -> Request a Proposal. */
const professionalCampaignContactHref = "/contact-us?for=proposal";

const maxPressReleaseWords = 700;
const coverPhotoTypes = ["image/jpeg", "image/png", "image/webp"];
const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const initialValues: SubmitYourPressReleaseValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  organization: "",
  releaseTitle: "",
  category: "",
  preferredDistributionDate: "",
  pressReleaseContent: "",
  targetRegions: "",
  specialInstructions: "",
  outboundLink: "",
};

function isValidOptionalHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);

    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function formatCurrency(value: number) {
  return `$${value}`;
}

function validateValues(values: SubmitYourPressReleaseValues) {
  const normalizedValues: SubmitYourPressReleaseValues = {
    fullName: values.fullName.trim().replace(/\s+/g, " "),
    email: values.email.trim().toLowerCase(),
    phoneNumber: values.phoneNumber.trim(),
    organization: values.organization.trim(),
    releaseTitle: values.releaseTitle.trim(),
    category: values.category.trim(),
    preferredDistributionDate: values.preferredDistributionDate.trim(),
    pressReleaseContent: values.pressReleaseContent.trim(),
    targetRegions: values.targetRegions.trim(),
    specialInstructions: values.specialInstructions.trim(),
    outboundLink: (() => {
      const raw = values.outboundLink.trim().slice(0, 2048);

      if (!raw) {
        return "";
      }

      return /^www\./i.test(raw) ? `https://${raw}` : raw;
    })(),
  };

  const errors: SubmitYourPressReleaseErrors = {};

  if (!normalizedValues.fullName) {
    errors.fullName = "Full name is required.";
  }

  if (!normalizedValues.email) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValues.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!normalizedValues.organization) {
    errors.organization = "Organization is required.";
  }

  if (!normalizedValues.releaseTitle) {
    errors.releaseTitle = "Release title is required.";
  }

  if (!normalizedValues.category) {
    errors.category = "Category is required.";
  }

  if (!normalizedValues.pressReleaseContent) {
    errors.pressReleaseContent = "Press release content is required.";
  } else if (countWords(normalizedValues.pressReleaseContent) > maxPressReleaseWords) {
    errors.pressReleaseContent = "Press release content must be 700 words or less.";
  }

  if (normalizedValues.outboundLink && !isValidOptionalHttpUrl(normalizedValues.outboundLink)) {
    errors.outboundLink = "Enter a valid http or https URL, or leave this blank.";
  }

  return {
    values: Object.keys(errors).length > 0 ? null : normalizedValues,
    errors,
  };
}

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function toLocalDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

/** Parse `<input type="date">` value (`YYYY-MM-DD`) in local calendar time. */
function dateFromPreferredDistributionInput(value: string): Date | null {
  const raw = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);

  if (!match) {
    return null;
  }

  const y = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isFinite(y) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  const parsed = new Date(y, month - 1, day);

  if (
    parsed.getFullYear() !== y
    || parsed.getMonth() !== month - 1
    || parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

const PREVIEW_FALLBACK_IMAGE = "/images/temp/latest-news-1.svg";

function previewDescriptionFromContent(content: string): string {
  const t = stripTagsToPlainText(content);
  if (!t) {
    return "Press release summary will appear here.";
  }

  return truncatePlainExcerpt(t, 280);
}

function previewMetaDate(snapshot: SubmitYourPressReleaseValues): string {
  const raw = snapshot.preferredDistributionDate?.trim();

  if (raw) {
    const local = dateFromPreferredDistributionInput(raw);

    if (local) {
      const stable = new Date(
        Date.UTC(local.getFullYear(), local.getMonth(), local.getDate(), 12, 0, 0),
      );

      return formatReleaseDate(stable.toISOString());
    }

    const parsed = new Date(raw);

    if (!Number.isNaN(parsed.getTime())) {
      return formatReleaseDate(parsed.toISOString());
    }
  }

  return formatReleaseDate(new Date().toISOString());
}

function previewMetaTime(): string {
  return formatReleaseTime(new Date().toISOString());
}

function walletCreditPackageTitle(packageType: string | null) {
  if (packageType === "bundle") return "3-Release Package";
  if (packageType === "single") return "Single Release";
  return "Credit package";
}

type SubmitYourPressReleaseFormProps = {
  submitter: {
    firstName: string;
    lastName: string;
    email: string;
    organization: string | null;
    phone: string | null;
    credits: number;
    creditsExpiresAt?: string | null;
    bundleCreditsExpiresAt?: string | null;
    bundleCreditsRemaining?: number;
    permanentCredits?: number;
    packageType: string | null;
  };
  initialPackage: PackageId | null;
};

export default function SubmitYourPressReleaseForm({ submitter, initialPackage }: SubmitYourPressReleaseFormProps) {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PackageId>(initialPackage ?? "single");
  const [isFeaturedPlacementEnabled, setIsFeaturedPlacementEnabled] =
    useState(false);
  const [formValues, setFormValues] =
    useState<SubmitYourPressReleaseValues>({
      ...initialValues,
      fullName: `${submitter.firstName} ${submitter.lastName}`.trim(),
      email: submitter.email,
      phoneNumber: submitter.phone ?? "",
      organization: submitter.organization ?? "",
    });
  const [fieldErrors, setFieldErrors] = useState<SubmitYourPressReleaseErrors>(
    {},
  );
  const [coverPhotoName, setCoverPhotoName] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null,
  );
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSnapshot, setPreviewSnapshot] = useState<SubmitYourPressReleaseValues | null>(null);
  const [previewImageObjectUrl, setPreviewImageObjectUrl] = useState<string | null>(null);
  const hasUsableCredits = submitter.credits > 0;
  const walletExpiryNote =
    hasUsableCredits &&
    submitter.creditsExpiresAt &&
    new Date(submitter.creditsExpiresAt) > new Date();

  useEffect(() => {
    if (!previewOpen) {
      setPreviewImageObjectUrl(null);
      return;
    }

    if (!coverPhotoFile) {
      setPreviewImageObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(coverPhotoFile);
    setPreviewImageObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [previewOpen, coverPhotoFile]);

  const selectedPackageData = useMemo(
    () =>
      packageOptions.find((option) => option.id === selectedPackage) ??
      packageOptions[0],
    [selectedPackage],
  );

  const featuredPlacementPrice = isFeaturedPlacementEnabled ? 99 : 0;
  /** User has no credits but chose a paid package — continue to checkout instead of blocking. */
  const purchasingCredits = !hasUsableCredits && (selectedPackage === "single" || selectedPackage === "bundle");
  const paidPackageDollarTotal =
    purchasingCredits && selectedPackageData.price !== null
      ? selectedPackageData.price + featuredPlacementPrice
      : null;
  const wordCount = countWords(formValues.pressReleaseContent);
  const isOverWordLimit = wordCount > maxPressReleaseWords;
  const preferredDistributionDateMin = useMemo(() => toLocalDateInputValue(new Date()), []);

  function updateField<K extends keyof SubmitYourPressReleaseValues>(
    field: K,
    value: string,
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      if (!current[field as keyof SubmitYourPressReleaseErrors]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field as keyof SubmitYourPressReleaseErrors];
      return nextErrors;
    });
  }

  function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>,
    target: "coverPhoto" | "document",
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (target === "coverPhoto") {
      if (!coverPhotoTypes.includes(selectedFile.type)) {
        setFieldErrors((current) => ({ ...current, coverPhoto: "Only JPG, PNG, WebP files are allowed" }));
        setToast({ tone: "error", message: "Only JPG, PNG, WebP files are allowed" });
        setCoverPhotoName("");
        setCoverPhotoFile(null);
        event.target.value = "";
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setFieldErrors((current) => ({ ...current, coverPhoto: "Image must be under 5MB" }));
        setToast({ tone: "error", message: "Image must be under 5MB" });
        setCoverPhotoName("");
        setCoverPhotoFile(null);
        event.target.value = "";
        return;
      }

      setFieldErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors.coverPhoto;
        return nextErrors;
      });
      setCoverPhotoName(selectedFile.name);
      setCoverPhotoFile(selectedFile);
    } else {
      if (!documentTypes.includes(selectedFile.type)) {
        setFieldErrors((current) => ({ ...current, document: "Only PDF, DOC, DOCX files are allowed" }));
        setToast({ tone: "error", message: "Only PDF, DOC, DOCX files are allowed" });
        setDocumentName("");
        setDocumentFile(null);
        event.target.value = "";
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setFieldErrors((current) => ({ ...current, document: "Document must be under 10MB" }));
        setToast({ tone: "error", message: "Document must be under 10MB" });
        setDocumentName("");
        setDocumentFile(null);
        event.target.value = "";
        return;
      }

      setFieldErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors.document;
        return nextErrors;
      });
      setDocumentName(selectedFile.name);
      setDocumentFile(selectedFile);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedPackage === "custom") {
      router.push(professionalCampaignContactHref);
      return;
    }

    const validation = validateValues(formValues);

    if (!validation.values) {
      setFieldErrors(validation.errors);
      setSubmissionMessage("Complete the required fields before continuing.");
      setToast({ tone: "error", message: "Complete the required fields before continuing." });
      return;
    }

    if (isOverWordLimit) {
      setFieldErrors((current) => ({ ...current, pressReleaseContent: "Press release content must be 700 words or less." }));
      setSubmissionMessage("Reduce the press release content to 700 words or less before continuing.");
      setToast({ tone: "error", message: "Reduce the press release content to 700 words or less before continuing." });
      return;
    }

    if (fieldErrors.coverPhoto || fieldErrors.document) {
      setSubmissionMessage("Please fix the highlighted file upload before continuing.");
      setToast({ tone: "error", message: "Please fix the highlighted file upload before continuing." });
      return;
    }

    setFieldErrors({});
    setSubmissionMessage(null);

    if (purchasingCredits) {
      const orderSnapshot = {
        form: validation.values,
        packageType: selectedPackage,
        packageName: selectedPackageData.title,
        featuredAddon: isFeaturedPlacementEnabled,
        amount: (selectedPackageData.price ?? 0) + featuredPlacementPrice,
      };

      window.sessionStorage.setItem("carib_submission_form", JSON.stringify(orderSnapshot.form));
      window.sessionStorage.setItem(
        "carib_selected_package",
        JSON.stringify({
          type: orderSnapshot.packageType,
          name: orderSnapshot.packageName,
          featuredAddon: orderSnapshot.featuredAddon,
        }),
      );
      window.sessionStorage.setItem("carib_total_amount", String(orderSnapshot.amount));

      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("fullName", validation.values.fullName);
        formData.append("email", validation.values.email);
        formData.append("phoneNumber", validation.values.phoneNumber);
        formData.append("organization", validation.values.organization);
        formData.append("releaseTitle", validation.values.releaseTitle);
        formData.append("category", validation.values.category);
        formData.append("preferredDistributionDate", validation.values.preferredDistributionDate);
        formData.append("pressReleaseContent", validation.values.pressReleaseContent);
        formData.append("targetRegions", validation.values.targetRegions);
        formData.append("island", validation.values.targetRegions || "Regional");
        formData.append("specialInstructions", validation.values.specialInstructions);
        formData.append("outboundLink", validation.values.outboundLink);
        formData.append("packageId", selectedPackage);
        formData.append("featuredUpgrade", isFeaturedPlacementEnabled ? "1" : "0");

        if (coverPhotoFile) {
          formData.append("coverPhoto", coverPhotoFile);
        }

        if (documentFile) {
          formData.append("document", documentFile);
        }

        const response = await fetch("/api/press-releases/credit-checkout-session", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          setSubmissionMessage(typeof payload?.error === "string" ? payload.error : "We could not save your submission before checkout.");
          setToast({
            tone: "error",
            message: typeof payload?.error === "string" ? payload.error : "We could not save your submission before checkout.",
          });
          return;
        }

        const checkoutSessionId = typeof payload?.creditCheckoutSessionId === "string"
          ? payload.creditCheckoutSessionId
          : undefined;

        if (!checkoutSessionId) {
          setSubmissionMessage("We could not save your submission before checkout. Please try again.");
          setToast({ tone: "error", message: "We could not save your submission before checkout. Please try again." });
          return;
        }

        window.sessionStorage.setItem("carib_checkout_session_id", checkoutSessionId);
        router.push(`/checkout?package=${selectedPackage}&checkoutSessionId=${encodeURIComponent(checkoutSessionId)}`);
      } catch {
        setSubmissionMessage("We could not save your submission before checkout. Please try again.");
        setToast({ tone: "error", message: "We could not save your submission before checkout. Please try again." });
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const orderSnapshot = {
        form: validation.values,
        packageType: selectedPackage,
        packageName: selectedPackageData.title,
        featuredAddon: isFeaturedPlacementEnabled,
        amount: isFeaturedPlacementEnabled && hasUsableCredits ? 99 : 0,
      };

      window.sessionStorage.setItem("carib_submission_form", JSON.stringify(orderSnapshot.form));
      window.sessionStorage.setItem("carib_selected_package", JSON.stringify({
        type: orderSnapshot.packageType,
        name: orderSnapshot.packageName,
        featuredAddon: orderSnapshot.featuredAddon,
      }));
      window.sessionStorage.setItem("carib_total_amount", String(orderSnapshot.amount));

      const formData = new FormData();
      formData.append("fullName", validation.values.fullName);
      formData.append("email", validation.values.email);
      formData.append("phoneNumber", validation.values.phoneNumber);
      formData.append("organization", validation.values.organization);
      formData.append("releaseTitle", validation.values.releaseTitle);
      formData.append("category", validation.values.category);
      formData.append("preferredDistributionDate", validation.values.preferredDistributionDate);
      formData.append("pressReleaseContent", validation.values.pressReleaseContent);
      formData.append("targetRegions", validation.values.targetRegions);
      formData.append("island", validation.values.targetRegions || "Regional");
      formData.append("specialInstructions", validation.values.specialInstructions);
      formData.append("outboundLink", validation.values.outboundLink);
      formData.append("packageId", selectedPackage);
      formData.append("featuredUpgrade", isFeaturedPlacementEnabled ? "1" : "0");
      formData.append("useExistingCredit", "1");

      if (coverPhotoFile) {
        formData.append("coverPhoto", coverPhotoFile);
      }

      if (documentFile) {
        formData.append("document", documentFile);
      }

      const response = await fetch("/api/press-releases", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setSubmissionMessage(typeof payload?.error === "string" ? payload.error : "We could not save your press release.");
        setToast({ tone: "error", message: typeof payload?.error === "string" ? payload.error : "We could not save your press release." });
        return;
      }

      const releaseId = typeof payload?.release?.id === "string" ? payload.release.id : undefined;
      const pendingFeaturedPayment = Boolean(payload?.pendingFeaturedPayment);

      if (pendingFeaturedPayment && releaseId) {
        router.push(`/checkout?releaseId=${encodeURIComponent(releaseId)}`);
        return;
      }

      if (!releaseId) {
        setSubmissionMessage("Your release was saved successfully.");
        setToast({ tone: "success", message: "Your release was saved successfully." });
        return;
      }

      setSubmissionMessage("Your release was submitted for admin review. One credit was deducted.");
      setToast({ tone: "success", message: "Your release was submitted for admin review. One credit was deducted." });
      window.setTimeout(() => {
        const credits = typeof payload?.creditsRemaining === "number" ? String(payload.creditsRemaining) : "";
        const query = credits ? `?credits=${encodeURIComponent(credits)}` : "";
        router.push(`/submission-successful${query}`);
      }, 900);
    } catch {
      setSubmissionMessage("We could not save your press release right now. Please try again.");
      setToast({ tone: "error", message: "We could not save your press release right now. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function openPreview() {
    if (selectedPackage === "custom") {
      router.push(professionalCampaignContactHref);
      return;
    }

    const validation = validateValues(formValues);
    if (!validation.values) {
      setFieldErrors(validation.errors);
      setSubmissionMessage("Complete the required fields before preview.");
      setToast({ tone: "error", message: "Complete the required fields before preview." });
      return;
    }

    if (isOverWordLimit) {
      setToast({ tone: "error", message: "Reduce the press release content to 700 words or less." });
      return;
    }

    setPreviewSnapshot(validation.values);
    setPreviewOpen(true);
  }

  return (
    <section className={styles.submitPage}>
      {toast ? (
        <div className={`${styles.toast} ${toast.tone === "success" ? styles.toastSuccess : styles.toastError}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      ) : null}
      {previewOpen && previewSnapshot ? (
        <div className={styles.previewOverlay} role="dialog" aria-modal="true" aria-labelledby="submit-preview-heading">
          <div className={styles.previewDialog}>
            <h2 id="submit-preview-heading" className={styles.previewTitle}>
              Preview submission
            </h2>
            <div className={styles.previewNewsSlot}>
              <News variant="portal-bookmark">
                <News.Header>
                  <News.Image imgSrc={previewImageObjectUrl ?? PREVIEW_FALLBACK_IMAGE} />
                </News.Header>
                <News.Body>
                  <News.Meta>
                    <News.Territory>{previewSnapshot.targetRegions?.trim() || "Regional"}</News.Territory>
                    <News.Seprator type="line-seprator" />
                    <News.Date>{previewMetaDate(previewSnapshot)}</News.Date>
                    <News.Seprator />
                    <News.Time>{previewMetaTime()}</News.Time>
                  </News.Meta>
                  <News.Title>{stripTagsToPlainText(previewSnapshot.releaseTitle)}</News.Title>
                  <News.Description>{previewDescriptionFromContent(previewSnapshot.pressReleaseContent)}</News.Description>
                  <News.TagsList>
                    <News.Tag>{previewSnapshot.category}</News.Tag>
                    {isFeaturedPlacementEnabled ? <News.Tag>Featured</News.Tag> : null}
                  </News.TagsList>
                </News.Body>
              </News>
              <p className={styles.previewReadHint}>Read link will be available after your release is published.</p>
            </div>
            <div className={styles.previewActions}>
              <Button type="button" variant="secondary" size="md" onClick={() => setPreviewOpen(false)}>
                Back to edit
              </Button>
              <Button
                type="button"
                size="md"
                onClick={() => {
                  setPreviewOpen(false);
                  window.setTimeout(() => {
                    const el = document.getElementById("submit-your-press-release-form");
                    if (el instanceof HTMLFormElement) {
                      el.requestSubmit();
                    }
                  }, 0);
                }}
              >
                Submit release
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <Container className={styles.submitInner}>
        <div className={styles.contentGrid}>
          <aside className={styles.summaryColumn}>
            <section className={styles.summaryCard}>
              <h2>{hasUsableCredits ? "Credit & submission" : "Order summary"}</h2>

              <div className={styles.summaryBlock}>
                <span className={styles.summaryLabel}>{hasUsableCredits ? "Your wallet" : "Select package"}</span>

                {hasUsableCredits ? (
                  <div className={styles.walletCreditCard}>
                    <p>
                      <strong>{walletCreditPackageTitle(submitter.packageType)}</strong>
                    </p>
                    <p>
                      <strong>{submitter.credits}</strong> credit{submitter.credits === 1 ? "" : "s"} available
                    </p>
                    <p>This submission will use <strong>1 credit</strong>.</p>
                    {walletExpiryNote ? (
                      <p className={styles.walletExpiry}>
                        Wallet credits expire six months after each purchase or grant. Next expiry on your account:{" "}
                        {new Date(submitter.creditsExpiresAt!).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className={styles.packageList}>
                    {packageOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.packageOption} ${selectedPackage === option.id ? styles.packageOptionActive : ""}`}
                        onClick={() => setSelectedPackage(option.id)}
                      >
                        <strong>{option.title}</strong>
                        <span>{option.subtitle}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.summaryDivider} />

              <button
                type="button"
                className={`${styles.addOnCard} ${isFeaturedPlacementEnabled ? styles.addOnCardActive : ""}`}
                onClick={() =>
                  setIsFeaturedPlacementEnabled((current) => !current)
                }
              >
                <div className={styles.labelWithBadge}>
                  <strong>Featured placement</strong>
                  <div className={styles.addOnBadge}>+$99</div>
                </div>
                <p>Homepage spotlight, priority review, and top positioning</p>
              </button>

              <div className={styles.summaryDividerPackage} />

              <div className={styles.totalsBlock}>
                <div className={styles.summaryRow}>
                  <span>Available credits</span>
                  <strong>{submitter.credits}</strong>
                </div>
                <div className={styles.summaryDividerTotal} />
                <div className={styles.summaryRow}>
                  <span>Package</span>
                  <strong>
                    {hasUsableCredits
                      ? walletCreditPackageTitle(submitter.packageType)
                      : selectedPackageData.price === null
                        ? "Contact us"
                        : formatCurrency(selectedPackageData.price)}
                  </strong>
                </div>

                <div className={styles.summaryDividerTotal} />

                {isFeaturedPlacementEnabled ? (
                  <div className={styles.summaryRow}>
                    <span>Featured placement</span>
                    <strong>{formatCurrency(featuredPlacementPrice)}</strong>
                  </div>
                ) : null}

                {isFeaturedPlacementEnabled ? (
                  <div className={styles.summaryDividerTotal} />
                ) : null}

                <div
                  className={`${styles.summaryRow} ${styles.summaryTotalRow}`}
                >
                  <span>Total</span>
                  <strong>
                    {paidPackageDollarTotal !== null
                      ? formatCurrency(paidPackageDollarTotal)
                      : hasUsableCredits && isFeaturedPlacementEnabled
                        ? formatCurrency(featuredPlacementPrice)
                        : hasUsableCredits
                          ? "$0"
                          : selectedPackage === "custom"
                            ? "—"
                            : "$0"}
                  </strong>
                </div>
              </div>

              <div className={styles.includedCard}>
                <strong>What&apos;s Included:</strong>

                <ul>
                  {selectedPackageData.includedItems.map((item) => (
                    <li key={item}>
                      <Check size={16} strokeWidth={2.2} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="submit"
                form="submit-your-press-release-form"
                size="md"
                className={styles.continueButton}
                disabled={
                  isSubmitting
                  || (selectedPackage !== "custom"
                    && (isOverWordLimit
                      || Boolean(fieldErrors.coverPhoto || fieldErrors.document || fieldErrors.outboundLink)))
                }
              >
                {isSubmitting
                  ? "Saving..."
                  : purchasingCredits
                    ? "Continue to checkout"
                    : hasUsableCredits && isFeaturedPlacementEnabled
                      ? "Continue to checkout"
                      : selectedPackage === "custom"
                        ? "Request a Proposal"
                        : "Submit release"}
              </Button>

              {hasUsableCredits || purchasingCredits ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className={styles.previewButton}
                  disabled={isSubmitting}
                  onClick={() => openPreview()}
                >
                  Preview submission
                </Button>
              ) : null}

              <p className={styles.secureNote}>
                Secure payment processing. You&apos;ll review everything before final submission.
              </p>
            </section>

            <section className={styles.helpCard}>
              <h2>Need Help?</h2>
              <p>Our team is ready to assist you with your submission.</p>
              <a href="mailto:info@caribnewswire.com">info@caribnewswire.com</a>
            </section>
          </aside>

          <section className={styles.formPanel}>
            <p className={styles.panelEyebrow}>Release Information</p>

            <form
              id="submit-your-press-release-form"
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <SvgIcon icon="contact-information" />
                  <h2>Contact Information</h2>
                </div>

                <div className={styles.formGrid}>
                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-full-name">
                      Full Name *
                    </FormLabel>
                    <Input
                      id="submit-press-release-full-name"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      value={formValues.fullName}
                      onChange={(event) =>
                        updateField("fullName", event.target.value)
                      }
                      aria-invalid={Boolean(fieldErrors.fullName)}
                    />
                    {fieldErrors.fullName ? (
                      <p className={styles.fieldError}>
                        {fieldErrors.fullName}
                      </p>
                    ) : null}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-email">
                      Email Address *
                    </FormLabel>
                    <Input
                      id="submit-press-release-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="john@company.com"
                      value={formValues.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      aria-invalid={Boolean(fieldErrors.email)}
                    />
                    {fieldErrors.email ? (
                      <p className={styles.fieldError}>{fieldErrors.email}</p>
                    ) : null}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-phone-number">
                      Phone Number
                    </FormLabel>
                    <Input
                      id="submit-press-release-phone-number"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 (340) 555-0123"
                      value={formValues.phoneNumber}
                      onChange={(event) =>
                        updateField("phoneNumber", event.target.value)
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-organization">
                      Organization *
                    </FormLabel>
                    <Input
                      id="submit-press-release-organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="Company Name"
                      value={formValues.organization}
                      onChange={(event) =>
                        updateField("organization", event.target.value)
                      }
                      aria-invalid={Boolean(fieldErrors.organization)}
                    />
                    {fieldErrors.organization ? (
                      <p className={styles.fieldError}>
                        {fieldErrors.organization}
                      </p>
                    ) : null}
                  </FormControl>
                </div>
              </div>

              <div className={styles.sectionDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <SvgIcon icon="press-release-details" />
                  <h2>Press Release Details</h2>
                </div>

                <div className={styles.detailsStack}>
                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-title">
                      Release Title *
                    </FormLabel>
                    <Input
                      id="submit-press-release-title"
                      name="releaseTitle"
                      type="text"
                      placeholder="Your Press Release Headline"
                      value={formValues.releaseTitle}
                      onChange={(event) =>
                        updateField("releaseTitle", event.target.value)
                      }
                      aria-invalid={Boolean(fieldErrors.releaseTitle)}
                    />
                    {fieldErrors.releaseTitle ? (
                      <p className={styles.fieldError}>
                        {fieldErrors.releaseTitle}
                      </p>
                    ) : null}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-category">
                      Category *
                    </FormLabel>
                    <select
                      id="submit-press-release-category"
                      name="category"
                      className={styles.selectField}
                      value={formValues.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      aria-invalid={Boolean(fieldErrors.category)}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {fieldErrors.category ? (
                      <p className={styles.fieldError}>
                        {fieldErrors.category}
                      </p>
                    ) : null}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-preferred-date">
                      Preferred Distribution Date
                    </FormLabel>
                    <Input
                      id="submit-press-release-preferred-date"
                      name="preferredDistributionDate"
                      type="date"
                      min={preferredDistributionDateMin}
                      autoComplete="off"
                      value={formValues.preferredDistributionDate}
                      onChange={(event) =>
                        updateField(
                          "preferredDistributionDate",
                          event.target.value,
                        )
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <label
                      htmlFor="submit-press-release-cover-photo"
                      className={`${styles.uploadField} ${styles.coverUploadField} ${coverPhotoName ? styles.uploadFieldActive : ""}`}
                    >
                      <input
                        id="submit-press-release-cover-photo"
                        name="coverPhoto"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className={styles.hiddenFileInput}
                        onChange={(event) =>
                          handleFileSelection(event, "coverPhoto")
                        }
                      />

                      <ImageUp size={48} strokeWidth={1.8} />
                      <strong>{coverPhotoName || "Upload cover photo"}</strong>
                      <span>
                        This image will appear with your press release
                      </span>
                      <small>
                        JPG, PNG, or WebP (Max 5MB, recommended 1200×630px)
                      </small>
                    </label>
                    {fieldErrors.coverPhoto ? (
                      <p className={styles.fieldError}>{fieldErrors.coverPhoto}</p>
                    ) : null}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-content">
                      Press Release Content *
                    </FormLabel>
                    <Textarea
                      className={styles.contentTextarea}
                      id="submit-press-release-content"
                      name="pressReleaseContent"
                      rows={7}
                      placeholder="Paste your press release content here or upload a file below..."
                      value={formValues.pressReleaseContent}
                      onChange={(event) =>
                        updateField("pressReleaseContent", event.target.value)
                      }
                      aria-invalid={Boolean(fieldErrors.pressReleaseContent)}
                    />
                    <div className={`${styles.wordCounter} ${isOverWordLimit ? styles.wordCounterError : ""}`}>
                      {wordCount} / {maxPressReleaseWords} words
                    </div>
                    {isOverWordLimit ? (
                      <p className={styles.fieldError}>Press release content exceeds the 700 word limit.</p>
                    ) : null}
                    {fieldErrors.pressReleaseContent ? (
                      <p className={styles.fieldError}>
                        {fieldErrors.pressReleaseContent}
                      </p>
                    ) : null}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-document">
                      Upload Document (Optional)
                    </FormLabel>
                    <label
                      htmlFor="submit-press-release-document"
                      className={`${styles.uploadField} ${styles.documentUploadField} ${documentName ? styles.uploadFieldActive : ""}`}
                    >
                      <input
                        id="submit-press-release-document"
                        name="document"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className={styles.hiddenFileInput}
                        onChange={(event) =>
                          handleFileSelection(event, "document")
                        }
                      />

                      <Upload size={32} strokeWidth={1.8} />
                      <strong>
                        {documentName ||
                          "Drop your file here or click to browse"}
                      </strong>
                      <small>
                        Supported formats: PDF, DOC, DOCX (Max 10MB)
                      </small>
                    </label>
                    {fieldErrors.document ? (
                      <p className={styles.fieldError}>{fieldErrors.document}</p>
                    ) : null}
                  </FormControl>
                </div>
              </div>

              <div className={styles.sectionDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeaderPlain}>
                  <h2>Additional Information</h2>
                </div>

                <div className={styles.detailsStack}>
                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-target-regions">
                      Target Islands/Regions
                    </FormLabel>
                    <Input
                      id="submit-press-release-target-regions"
                      name="targetRegions"
                      type="text"
                      placeholder="e.g., USVI, Jamaica, All Caribbean"
                      value={formValues.targetRegions}
                      onChange={(event) =>
                        updateField("targetRegions", event.target.value)
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-special-instructions">
                      Special Instructions
                    </FormLabel>
                    <Textarea
                      id="submit-press-release-special-instructions"
                      name="specialInstructions"
                      rows={4}
                      placeholder="Any specific requirements or instructions for distribution..."
                      value={formValues.specialInstructions}
                      onChange={(event) =>
                        updateField("specialInstructions", event.target.value)
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="submit-press-release-outbound-link">Outbound Link (optional)</FormLabel>
                    <Input
                      id="submit-press-release-outbound-link"
                      name="outboundLink"
                      type="url"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="https://yourwebsite.com"
                      value={formValues.outboundLink}
                      onChange={(event) => updateField("outboundLink", event.target.value)}
                      aria-invalid={Boolean(fieldErrors.outboundLink)}
                    />
                    {fieldErrors.outboundLink ? (
                      <p className={styles.fieldError}>{fieldErrors.outboundLink}</p>
                    ) : null}
                  </FormControl>
                </div>
              </div>

              {submissionMessage ? (
                <p className={styles.submissionMessage}>{submissionMessage}</p>
              ) : null}
            </form>
          </section>
        </div>
      </Container>
    </section>
  );
}
