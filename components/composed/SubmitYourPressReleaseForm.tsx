"use client";

import styles from "./SubmitYourPressReleaseForm.module.scss";

import { Check, FileText, ImageUp, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CHECKOUT_PAYMENTS_NOTICE,
  CHECKOUT_PAYMENTS_NOTICE_TITLE,
  CHECKOUT_PAYMENTS_UNAVAILABLE,
} from "@/lib/checkout-payments-unavailable";
import {
  CHECKOUT_SESSION_EXPIRED_MESSAGE,
  resolveCheckoutStartError,
} from "@/lib/checkout-session-errors";
import { apiValidationErrorsByField } from "@/lib/format-api-validation-errors";
import {
  COVER_PHOTO_ACCEPT,
  COVER_PHOTO_UPLOAD_HINT,
  DOCUMENT_ACCEPT,
  DOCUMENT_UPLOAD_HINT,
  validateCoverPhotoFile,
  validateDocumentFile,
} from "@/lib/press-release-upload-limits";
import { formatReleaseDate, formatReleaseTime } from "@/lib/press-release-display";
import { stripTagsToPlainText, truncatePlainExcerpt } from "@/lib/press-release-list-excerpt";
import { PRESS_RELEASE_CATEGORIES } from "@/lib/press-release-categories";
import { territoryOptions } from "@/lib/enquiry-options";

import { Container } from "../layout";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  News,
  Select,
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
  summary: string;
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
    | "summary"
    | "category"
    | "targetRegions"
    | "preferredDistributionDate"
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

const categories = [...PRESS_RELEASE_CATEGORIES];

const categoryOptions = [
  { value: "", label: "Select category" },
  ...categories.map((category) => ({ value: category, label: category })),
];

const regionOptions = [
  { value: "", label: "Select region" },
  ...territoryOptions.map((option) => ({ value: option.label, label: option.label })),
];

const FORM_STEPS = [
  { id: 1, title: "Contact Information", subtitle: "Your organization and contact details", nextLabel: "Release Details" },
  { id: 2, title: "Press Release Details", subtitle: "Title, category, region and date", nextLabel: "Content" },
  { id: 3, title: "Press Release Content", subtitle: "Summary and full body text", nextLabel: "Upload Assets" },
  { id: 4, title: "Upload Assets", subtitle: "Images and supporting documents", nextLabel: "Review & Submit" },
  { id: 5, title: "Review & Submit", subtitle: "Confirm details and choose add-ons", nextLabel: null },
] as const;

const STEP_ERROR_FIELDS: Record<number, (keyof SubmitYourPressReleaseErrors)[]> = {
  1: ["organization", "fullName", "email"],
  2: ["releaseTitle", "category", "targetRegions", "preferredDistributionDate"],
  3: ["summary", "pressReleaseContent"],
  4: ["coverPhoto", "document", "outboundLink"],
  5: [],
};

const sidebarHighlightItems = [
  "Editorial review within 48h",
  "Caribbean-wide distribution",
  "Newsroom publication",
  "Analytics report included",
];

/** Same destination as pricing "Professional Campaigns" -> Request a Proposal. */
const professionalCampaignContactHref = "/contact-us?for=proposal";

const maxPressReleaseWords = 700;
const maxReleaseTitleLength = 100;
const maxSummaryLength = 300;

function validateUploadFiles(
  coverPhoto: File | null,
  document: File | null,
): Partial<SubmitYourPressReleaseErrors> {
  const errors: Partial<SubmitYourPressReleaseErrors> = {};

  if (!coverPhoto) {
    errors.coverPhoto = "Cover image is required.";
    return errors;
  }

  const coverError = validateCoverPhotoFile(coverPhoto);

  if (coverError) {
    errors.coverPhoto = coverError;
  }

  if (document) {
    const documentError = validateDocumentFile(document);

    if (documentError) {
      errors.document = documentError;
    }
  }

  return errors;
}

const initialValues: SubmitYourPressReleaseValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  organization: "",
  releaseTitle: "",
  summary: "",
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
    summary: values.summary.trim(),
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
  } else if (normalizedValues.releaseTitle.length > maxReleaseTitleLength) {
    errors.releaseTitle = "Release title must be 100 characters or less.";
  }

  if (!normalizedValues.summary) {
    errors.summary = "Summary is required.";
  } else if (normalizedValues.summary.length > maxSummaryLength) {
    errors.summary = "Summary must be 300 characters or less.";
  }

  if (!normalizedValues.category) {
    errors.category = "Category is required.";
  }

  if (!normalizedValues.targetRegions) {
    errors.targetRegions = "Target region is required.";
  }

  if (!normalizedValues.preferredDistributionDate) {
    errors.preferredDistributionDate = "Publication date is required.";
  }

  if (!normalizedValues.pressReleaseContent.trim()) {
    errors.pressReleaseContent = "Press release content is required.";
  } else if (countPlainWords(normalizedValues.pressReleaseContent) > maxPressReleaseWords) {
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

/** Whitespace-separated tokens — matches backend submit validation. */
function countPlainWords(value: string) {
  const text = value.trim();

  if (!text) {
    return 0;
  }

  return text.split(/\s+/).filter(Boolean).length;
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
  activeStep: number;
  expandedStep: number | null;
  onStepChange: (step: number) => void;
  onExpandedStepChange: (step: number | null) => void;
};

export default function SubmitYourPressReleaseForm({
  submitter,
  initialPackage,
  activeStep,
  expandedStep,
  onStepChange,
  onExpandedStepChange,
}: SubmitYourPressReleaseFormProps) {
  const router = useRouter();
  const stepRefs = useRef<Partial<Record<number, HTMLElement | null>>>({});
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
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSnapshot, setPreviewSnapshot] = useState<SubmitYourPressReleaseValues | null>(null);
  const [previewImageObjectUrl, setPreviewImageObjectUrl] = useState<string | null>(null);
  const hasUsableCredits = submitter.credits > 0;

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
  const submitFormPaused = CHECKOUT_PAYMENTS_UNAVAILABLE;
  const paidPackageDollarTotal =
    purchasingCredits && selectedPackageData.price !== null
      ? selectedPackageData.price + featuredPlacementPrice
      : null;
  const pressReleaseContentLength = formValues.pressReleaseContent.length;
  const wordCount = countPlainWords(formValues.pressReleaseContent);
  const isOverWordLimit = wordCount > maxPressReleaseWords;
  const releaseTitleLength = formValues.releaseTitle.length;
  const isOverTitleLimit = releaseTitleLength > maxReleaseTitleLength;
  const summaryLength = formValues.summary.length;
  const isOverSummaryLimit = summaryLength > maxSummaryLength;
  const preferredDistributionDateMin = useMemo(() => toLocalDateInputValue(new Date()), []);

  useEffect(() => {
    if (submitFormPaused) {
      onExpandedStepChange(null);
    }
  }, [onExpandedStepChange, submitFormPaused]);

  const stepsWithErrors = useMemo(() => {
    const steps = new Set<number>();

    for (const [stepId, fields] of Object.entries(STEP_ERROR_FIELDS)) {
      if (fields.some((field) => Boolean(fieldErrors[field]))) {
        steps.add(Number(stepId));
      }
    }

    if (isOverTitleLimit) {
      steps.add(2);
    }

    if (isOverSummaryLimit || isOverWordLimit) {
      steps.add(3);
    }

    return steps;
  }, [fieldErrors, isOverTitleLimit, isOverSummaryLimit, isOverWordLimit]);

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
      const validationError = validateCoverPhotoFile(selectedFile);

      if (validationError) {
        setFieldErrors((current) => ({ ...current, coverPhoto: validationError }));
        setToast({ tone: "error", message: validationError });
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
      const validationError = validateDocumentFile(selectedFile);

      if (validationError) {
        setFieldErrors((current) => ({ ...current, document: validationError }));
        setToast({ tone: "error", message: validationError });
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
      setToast({ tone: "error", message: "Complete the required fields before continuing." });
      return;
    }

    if (isOverWordLimit) {
      setFieldErrors((current) => ({ ...current, pressReleaseContent: "Press release content must be 700 words or less." }));
      setToast({ tone: "error", message: "Reduce the press release content to 700 words or less before continuing." });
      return;
    }

    if (isOverTitleLimit) {
      setFieldErrors((current) => ({ ...current, releaseTitle: "Release title must be 100 characters or less." }));
      setToast({ tone: "error", message: "Reduce the release title to 100 characters or less before continuing." });
      return;
    }

    if (isOverSummaryLimit) {
      setFieldErrors((current) => ({ ...current, summary: "Summary must be 300 characters or less." }));
      setToast({ tone: "error", message: "Reduce the summary to 300 characters or less before continuing." });
      return;
    }

    const uploadErrors = validateUploadFiles(coverPhotoFile, documentFile);

    if (Object.keys(uploadErrors).length > 0) {
      setFieldErrors((current) => ({ ...current, ...uploadErrors }));
      const firstUploadError = uploadErrors.coverPhoto ?? uploadErrors.document ?? "Please fix the highlighted file upload before continuing.";
      setToast({ tone: "error", message: firstUploadError });
      return;
    }

    setFieldErrors({});

    if (submitFormPaused) {
      setToast({ tone: "error", message: CHECKOUT_PAYMENTS_NOTICE });
      return;
    }

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
        formData.append("summary", validation.values.summary);
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
          const apiFieldErrors = apiValidationErrorsByField(payload);

          if (Object.keys(apiFieldErrors).length > 0) {
            setFieldErrors((current) => ({ ...current, ...apiFieldErrors }));
          }

          const errorMessage = typeof payload?.error === "string"
            ? payload.error
            : resolveCheckoutStartError(payload, response.status);

          setToast({ tone: "error", message: errorMessage });

          if (apiFieldErrors.coverPhoto || apiFieldErrors.document) {
            onExpandedStepChange?.(4);
            onStepChange?.(4);
          }

          if (response.status === 401 || errorMessage === CHECKOUT_SESSION_EXPIRED_MESSAGE) {
            router.push(`/login?next=${encodeURIComponent(`/submit-your-press-release?package=${selectedPackage}`)}`);
          }

          return;
        }

        const checkoutSessionId = typeof payload?.creditCheckoutSessionId === "string"
          ? payload.creditCheckoutSessionId
          : undefined;

        if (!checkoutSessionId) {
          setToast({ tone: "error", message: "We could not save your submission before checkout. Please try again." });
          return;
        }

        window.sessionStorage.setItem("carib_checkout_session_id", checkoutSessionId);
        router.push(`/checkout?package=${selectedPackage}&checkoutSessionId=${encodeURIComponent(checkoutSessionId)}`);
      } catch {
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
      formData.append("summary", validation.values.summary);
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
        setToast({ tone: "success", message: "Your release was saved successfully." });
        return;
      }

      setToast({ tone: "success", message: "Your release was submitted for admin review. One credit was deducted." });
      window.setTimeout(() => {
        const credits = typeof payload?.creditsRemaining === "number" ? String(payload.creditsRemaining) : "";
        const query = credits ? `?credits=${encodeURIComponent(credits)}` : "";
        router.push(`/submission-successful${query}`);
      }, 900);
    } catch {
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
      setToast({ tone: "error", message: "Complete the required fields before preview." });
      return;
    }

    if (isOverWordLimit) {
      setToast({ tone: "error", message: "Reduce the press release content to 700 words or less." });
      return;
    }

    if (isOverTitleLimit) {
      setToast({ tone: "error", message: "Reduce the release title to 100 characters or less." });
      return;
    }

    if (isOverSummaryLimit) {
      setToast({ tone: "error", message: "Reduce the summary to 300 characters or less." });
      return;
    }

    if (!coverPhotoFile) {
      setFieldErrors((current) => ({ ...current, coverPhoto: "Cover image is required." }));
      setToast({ tone: "error", message: "Upload a cover image before previewing." });
      return;
    }

    setPreviewSnapshot(validation.values);
    setPreviewOpen(true);
  }

  function validateStep(step: number): boolean {
    const errors: SubmitYourPressReleaseErrors = {};

    if (step === 1) {
      if (!formValues.organization.trim()) errors.organization = "Organization is required.";
      if (!formValues.fullName.trim()) errors.fullName = "Contact name is required.";
      if (!formValues.email.trim()) errors.email = "Email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) errors.email = "Enter a valid email address.";
    }

    if (step === 2) {
      if (!formValues.releaseTitle.trim()) {
        errors.releaseTitle = "Release title is required.";
      } else if (formValues.releaseTitle.trim().length > maxReleaseTitleLength) {
        errors.releaseTitle = "Release title must be 100 characters or less.";
      }
      if (!formValues.category.trim()) errors.category = "Category is required.";
      if (!formValues.targetRegions.trim()) errors.targetRegions = "Target region is required.";
      if (!formValues.preferredDistributionDate.trim()) {
        errors.preferredDistributionDate = "Publication date is required.";
      }
    }

    if (step === 3) {
      if (!formValues.summary.trim()) {
        errors.summary = "Summary is required.";
      } else if (formValues.summary.trim().length > maxSummaryLength) {
        errors.summary = "Summary must be 300 characters or less.";
      }

      if (!formValues.pressReleaseContent.trim()) {
        errors.pressReleaseContent = "Press release content is required.";
      } else if (isOverWordLimit) {
        errors.pressReleaseContent = "Press release content must be 700 words or less.";
      }
    }

    if (step === 4) {
      if (!coverPhotoFile) {
        errors.coverPhoto = "Cover image is required.";
      } else if (fieldErrors.coverPhoto) {
        errors.coverPhoto = fieldErrors.coverPhoto;
      }

      if (fieldErrors.document) errors.document = fieldErrors.document;

      if (formValues.outboundLink.trim() && !isValidOptionalHttpUrl(
        /^www\./i.test(formValues.outboundLink.trim()) ? `https://${formValues.outboundLink.trim()}` : formValues.outboundLink.trim(),
      )) {
        errors.outboundLink = "Enter a valid http or https URL, or leave this blank.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((current) => ({ ...current, ...errors }));
      setToast({ tone: "error", message: "Complete the required fields before continuing." });
      return false;
    }

    return true;
  }

  function scrollToStep(step: number) {
    window.setTimeout(() => {
      stepRefs.current[step]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 320);
  }

  function goToNextStep() {
    if (submitFormPaused) {
      return;
    }

    if (!validateStep(activeStep)) {
      return;
    }

    setFieldErrors({});
    const nextStep = Math.min(5, activeStep + 1);
    onStepChange(nextStep);
    onExpandedStepChange(nextStep);
    scrollToStep(nextStep);
  }

  function toggleStep(step: number) {
    if (submitFormPaused) {
      return;
    }

    if (expandedStep === step) {
      onExpandedStepChange(null);
      return;
    }

    onStepChange(step);
    onExpandedStepChange(step);
    scrollToStep(step);
  }

  const displayTotal =
    paidPackageDollarTotal !== null
      ? paidPackageDollarTotal
      : hasUsableCredits && isFeaturedPlacementEnabled
        ? featuredPlacementPrice
        : hasUsableCredits
          ? 0
          : selectedPackage === "custom"
            ? null
            : selectedPackageData.price ?? 0;

  const submitButtonLabel = isSubmitting
    ? "Saving..."
    : submitFormPaused
      ? "Submissions temporarily paused"
      : hasUsableCredits || purchasingCredits
        ? "Submit & Continue"
        : selectedPackage === "custom"
          ? "Request a Proposal"
          : "Submit & Continue";

  const showPaymentNote =
    purchasingCredits
    || (hasUsableCredits && isFeaturedPlacementEnabled)
    || (!hasUsableCredits && selectedPackage !== "custom");

  const formattedDisplayTotal =
    displayTotal === null
      ? "—"
      : formatCurrency(displayTotal);

  const summaryHeading = hasUsableCredits ? "Available Credits" : "Your Package";

  const summaryTotalLabel = hasUsableCredits && !isFeaturedPlacementEnabled
    ? "Available credits"
    : "Total";

  const summaryTotalValue = hasUsableCredits && !isFeaturedPlacementEnabled
    ? `${submitter.credits} credit${submitter.credits === 1 ? "" : "s"}`
    : formattedDisplayTotal;

  return (
    <section className={styles.submitPage}>
      <div className={styles.curve} aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z" />
        </svg>
      </div>

      {toast ? (
        <div className={`${styles.toast} ${toast.tone === "success" ? styles.toastSuccess : styles.toastError}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      ) : null}
      {submitFormPaused ? (
        <div className={styles.paymentsUnavailableNotice} role="status" aria-live="polite">
          <strong>{CHECKOUT_PAYMENTS_NOTICE_TITLE}</strong>
          <p>{CHECKOUT_PAYMENTS_NOTICE}</p>
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
                    {isFeaturedPlacementEnabled ? (
                      <>
                        <News.Seprator type="line-seprator" />
                        <News.Date>{previewMetaDate(previewSnapshot)}</News.Date>
                        <News.Seprator />
                        <News.Time>{previewMetaTime()}</News.Time>
                      </>
                    ) : (
                      <News.Date>{previewMetaDate(previewSnapshot)}</News.Date>
                    )}
                  </News.Meta>
                  <News.Title>{stripTagsToPlainText(previewSnapshot.releaseTitle)}</News.Title>
                  <News.Description>
                    {previewSnapshot.summary?.trim()
                      ? truncatePlainExcerpt(previewSnapshot.summary.trim(), 280)
                      : previewDescriptionFromContent(previewSnapshot.pressReleaseContent)}
                  </News.Description>
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
        <div className={`${styles.contentGrid} ${submitFormPaused ? styles.contentGridPaused : ""}`}>
          <div className={styles.formColumn}>
            <form
              id="submit-your-press-release-form"
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              {FORM_STEPS.map((step) => {
                const isExpanded = !submitFormPaused && expandedStep === step.id;
                const isCurrentStep = activeStep === step.id;
                const hasStepError = stepsWithErrors.has(step.id);

                return (
                  <article
                    key={step.id}
                    id={`submit-step-${step.id}`}
                    ref={(node) => {
                      stepRefs.current[step.id] = node;
                    }}
                    className={`${styles.accordionStep} ${isExpanded ? styles.accordionStepExpanded : ""} ${hasStepError ? styles.accordionStepError : ""} ${submitFormPaused ? styles.accordionStepPaused : ""}`}
                  >
                    <button
                      type="button"
                      className={`${styles.accordionHeader} ${submitFormPaused ? styles.accordionHeaderDisabled : ""}`}
                      onClick={() => toggleStep(step.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`submit-step-panel-${step.id}`}
                      disabled={submitFormPaused}
                    >
                      <span
                        className={`${styles.stepBadge} ${isCurrentStep ? styles.stepBadgeActive : ""}`}
                        aria-hidden
                      >
                        {step.id}
                      </span>
                      <span className={styles.accordionHeaderText}>
                        <strong>{step.title}</strong>
                        <span>{step.subtitle}</span>
                      </span>
                      <span className={styles.accordionChevron} aria-hidden>
                        <SvgIcon icon="down-arrow" />
                      </span>
                    </button>

                    <div
                      className={`${styles.accordionBodyWrap} ${isExpanded ? styles.accordionBodyWrapOpen : ""}`}
                    >
                      <div
                        className={styles.accordionBodyInner}
                        id={`submit-step-panel-${step.id}`}
                        aria-hidden={!isExpanded}
                      >
                        {isExpanded ? (
                        <div className={styles.accordionBody}>
                        {step.id === 1 ? (
                          <div className={styles.formGrid}>
                            <FormControl>
                              <FormLabel htmlFor="submit-press-release-organization">
                                Organization Name <span className={styles.required}>*</span>
                              </FormLabel>
                              <Input
                                id="submit-press-release-organization"
                                name="organization"
                                type="text"
                                autoComplete="organization"
                                placeholder="Company Name"
                                value={formValues.organization}
                                onChange={(event) => updateField("organization", event.target.value)}
                                aria-invalid={Boolean(fieldErrors.organization)}
                              />
                              {fieldErrors.organization ? (
                                <p className={styles.fieldError}>{fieldErrors.organization}</p>
                              ) : null}
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor="submit-press-release-full-name">
                                Contact Name <span className={styles.required}>*</span>
                              </FormLabel>
                              <Input
                                id="submit-press-release-full-name"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                placeholder="John Doe"
                                value={formValues.fullName}
                                onChange={(event) => updateField("fullName", event.target.value)}
                                aria-invalid={Boolean(fieldErrors.fullName)}
                              />
                              {fieldErrors.fullName ? (
                                <p className={styles.fieldError}>{fieldErrors.fullName}</p>
                              ) : null}
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor="submit-press-release-email">
                                Email <span className={styles.required}>*</span>
                              </FormLabel>
                              <Input
                                id="submit-press-release-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="john@company.com"
                                value={formValues.email}
                                onChange={(event) => updateField("email", event.target.value)}
                                aria-invalid={Boolean(fieldErrors.email)}
                              />
                              {fieldErrors.email ? (
                                <p className={styles.fieldError}>{fieldErrors.email}</p>
                              ) : null}
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor="submit-press-release-phone-number">
                                Phone
                              </FormLabel>
                              <Input
                                id="submit-press-release-phone-number"
                                name="phoneNumber"
                                type="tel"
                                autoComplete="tel"
                                placeholder="+1 (340) 555-0123"
                                value={formValues.phoneNumber}
                                onChange={(event) => updateField("phoneNumber", event.target.value)}
                              />
                            </FormControl>
                          </div>
                        ) : null}

                        {step.id === 2 ? (
                          <div className={styles.detailsStack}>
                            <FormControl>
                              <div className={styles.labelWithCounter}>
                                <FormLabel htmlFor="submit-press-release-title">
                                  Release Title <span className={styles.required}>*</span>
                                </FormLabel>
                                <span
                                  className={`${styles.charCounter} ${isOverTitleLimit ? styles.charCounterError : ""}`}
                                >
                                  {releaseTitleLength}/{maxReleaseTitleLength}
                                </span>
                              </div>
                              <Input
                                id="submit-press-release-title"
                                name="releaseTitle"
                                type="text"
                                placeholder="Your press release headline"
                                value={formValues.releaseTitle}
                                onChange={(event) => updateField("releaseTitle", event.target.value)}
                                aria-invalid={Boolean(fieldErrors.releaseTitle) || isOverTitleLimit}
                              />
                              {isOverTitleLimit ? (
                                <p className={styles.fieldError}>Release title must be 100 characters or less.</p>
                              ) : fieldErrors.releaseTitle ? (
                                <p className={styles.fieldError}>{fieldErrors.releaseTitle}</p>
                              ) : null}
                            </FormControl>

                            <div className={styles.detailsRowTwo}>
                              <FormControl>
                                <FormLabel htmlFor="submit-press-release-category">
                                  Category <span className={styles.required}>*</span>
                                </FormLabel>
                                <Select
                                  id="submit-press-release-category"
                                  name="category"
                                  options={categoryOptions}
                                  value={formValues.category}
                                  onChange={(event) => updateField("category", event.target.value)}
                                  aria-invalid={Boolean(fieldErrors.category)}
                                />
                                {fieldErrors.category ? (
                                  <p className={styles.fieldError}>{fieldErrors.category}</p>
                                ) : null}
                              </FormControl>

                              <FormControl>
                                <FormLabel htmlFor="submit-press-release-target-regions">
                                  Target Region <span className={styles.required}>*</span>
                                </FormLabel>
                                <Select
                                  id="submit-press-release-target-regions"
                                  name="targetRegions"
                                  options={regionOptions}
                                  value={formValues.targetRegions}
                                  onChange={(event) => updateField("targetRegions", event.target.value)}
                                  aria-invalid={Boolean(fieldErrors.targetRegions)}
                                />
                                {fieldErrors.targetRegions ? (
                                  <p className={styles.fieldError}>{fieldErrors.targetRegions}</p>
                                ) : null}
                              </FormControl>
                            </div>

                            <FormControl>
                              <FormLabel htmlFor="submit-press-release-preferred-date">
                                Publication Date <span className={styles.required}>*</span>
                              </FormLabel>
                              <Input
                                id="submit-press-release-preferred-date"
                                name="preferredDistributionDate"
                                type="date"
                                min={preferredDistributionDateMin}
                                autoComplete="off"
                                value={formValues.preferredDistributionDate}
                                onChange={(event) =>
                                  updateField("preferredDistributionDate", event.target.value)
                                }
                                aria-invalid={Boolean(fieldErrors.preferredDistributionDate)}
                              />
                              {fieldErrors.preferredDistributionDate ? (
                                <p className={styles.fieldError}>{fieldErrors.preferredDistributionDate}</p>
                              ) : null}
                            </FormControl>
                          </div>
                        ) : null}

                        {step.id === 3 ? (
                          <div className={styles.detailsStack}>
                            <FormControl>
                              <div className={styles.labelWithCounter}>
                                <FormLabel htmlFor="submit-press-release-summary">
                                  Summary <span className={styles.required}>*</span>
                                </FormLabel>
                                <span
                                  className={`${styles.charCounter} ${isOverSummaryLimit ? styles.charCounterError : ""}`}
                                >
                                  {summaryLength}/{maxSummaryLength}
                                </span>
                              </div>
                              <Textarea
                                id="submit-press-release-summary"
                                name="summary"
                                rows={4}
                                placeholder="A 2–3 sentence summary of your press release..."
                                value={formValues.summary}
                                onChange={(event) => updateField("summary", event.target.value)}
                                aria-invalid={Boolean(fieldErrors.summary) || isOverSummaryLimit}
                              />
                              {isOverSummaryLimit ? (
                                <p className={styles.fieldError}>Summary must be 300 characters or less.</p>
                              ) : fieldErrors.summary ? (
                                <p className={styles.fieldError}>{fieldErrors.summary}</p>
                              ) : null}
                            </FormControl>

                            <FormControl>
                              <div className={styles.labelWithCounter}>
                                <FormLabel htmlFor="submit-press-release-content">
                                  Full Press Release Content <span className={styles.required}>*</span>
                                </FormLabel>
                                <span
                                  className={`${styles.wordCounter} ${isOverWordLimit ? styles.wordCounterError : ""}`}
                                >
                                  {wordCount}/{maxPressReleaseWords} words · {pressReleaseContentLength} characters
                                </span>
                              </div>
                              <Textarea
                                id="submit-press-release-content"
                                name="pressReleaseContent"
                                rows={10}
                                placeholder="Write or paste your full press release content here. Include all relevant details, quotes, and context..."
                                value={formValues.pressReleaseContent}
                                onChange={(event) => updateField("pressReleaseContent", event.target.value)}
                                onInput={(event) => updateField("pressReleaseContent", event.currentTarget.value)}
                                aria-invalid={Boolean(fieldErrors.pressReleaseContent) || isOverWordLimit}
                              />
                              <p className={styles.wordCounterHint}>
                                Words are counted when separated by spaces. The limit is 700 words.
                              </p>
                              {isOverWordLimit ? (
                                <p className={styles.fieldError}>Press release content exceeds the 700 word limit.</p>
                              ) : fieldErrors.pressReleaseContent ? (
                                <p className={styles.fieldError}>{fieldErrors.pressReleaseContent}</p>
                              ) : null}
                            </FormControl>
                          </div>
                        ) : null}

                        {step.id === 4 ? (
                          <div className={styles.uploadStack}>
                            <div className={styles.uploadSection}>
                              <p className={styles.uploadSectionLabel}>
                                Image <span className={styles.required}>*</span>
                              </p>
                              <label
                                htmlFor="submit-press-release-cover-photo"
                                className={`${styles.uploadField} ${coverPhotoName ? styles.uploadFieldActive : ""}`}
                              >
                                <input
                                  id="submit-press-release-cover-photo"
                                  name="coverPhoto"
                                  type="file"
                                  accept={COVER_PHOTO_ACCEPT}
                                  className={styles.hiddenFileInput}
                                  onChange={(event) => handleFileSelection(event, "coverPhoto")}
                                />
                                <span className={styles.uploadFieldIcon} aria-hidden>
                                  <ImageUp size={28} strokeWidth={1.8} />
                                </span>
                                <strong>{coverPhotoName || "Upload Image"}</strong>
                                <span>{COVER_PHOTO_UPLOAD_HINT}</span>
                              </label>
                              {fieldErrors.coverPhoto ? (
                                <p className={styles.fieldError}>{fieldErrors.coverPhoto}</p>
                              ) : null}
                            </div>

                            <div className={styles.uploadSection}>
                              <p className={styles.uploadSectionLabel}>Documents</p>
                              <label
                                htmlFor="submit-press-release-document"
                                className={`${styles.uploadField} ${documentName ? styles.uploadFieldActive : ""}`}
                              >
                                <input
                                  id="submit-press-release-document"
                                  name="document"
                                  type="file"
                                  accept={DOCUMENT_ACCEPT}
                                  className={styles.hiddenFileInput}
                                  onChange={(event) => handleFileSelection(event, "document")}
                                />
                                <span className={styles.uploadFieldIcon} aria-hidden>
                                  <FileText size={28} strokeWidth={1.8} />
                                </span>
                                <strong>{documentName || "Upload Documents"}</strong>
                                <span>{DOCUMENT_UPLOAD_HINT}</span>
                              </label>
                              {fieldErrors.document ? (
                                <p className={styles.fieldError}>{fieldErrors.document}</p>
                              ) : null}
                            </div>

                            <FormControl>
                              <FormLabel htmlFor="submit-press-release-outbound-link">
                                Outbound Link (optional)
                              </FormLabel>
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

                            <FormControl>
                              <FormLabel htmlFor="submit-press-release-special-instructions">
                                Special Instructions (optional)
                              </FormLabel>
                              <Textarea
                                id="submit-press-release-special-instructions"
                                name="specialInstructions"
                                rows={4}
                                placeholder="Any specific requirements or instructions for distribution..."
                                value={formValues.specialInstructions}
                                onChange={(event) => updateField("specialInstructions", event.target.value)}
                              />
                            </FormControl>
                          </div>
                        ) : null}

                        {step.id === 5 ? (
                          <div className={styles.detailsStack}>
                            <div className={styles.addOnSection}>
                              <p className={styles.uploadSectionLabel}>Distribution Add-ons</p>
                              <div className={`${styles.addOnCard} ${isFeaturedPlacementEnabled ? styles.addOnCardActive : ""}`}>
                                <div className={styles.addOnCardCopy}>
                                  <strong>Featured Placement</strong>
                                  <span>Appear at the top of the newsroom for 7 days</span>
                                </div>
                                <div className={styles.addOnCardActions}>
                                  <span className={styles.addOnPrice}>+$99</span>
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isFeaturedPlacementEnabled}
                                    className={`${styles.addOnSwitch} ${isFeaturedPlacementEnabled ? styles.addOnSwitchOn : ""}`}
                                    onClick={() => setIsFeaturedPlacementEnabled((current) => !current)}
                                  >
                                    <span className={styles.addOnSwitchThumb} aria-hidden />
                                  </button>
                                </div>
                              </div>
                              {isFeaturedPlacementEnabled ? (
                                <ul className={styles.featuredBenefitList}>
                                  <li className={styles.featuredBenefitItem}>Homepage spotlight for 7 days</li>
                                  <li className={styles.featuredBenefitItem}>Top positioning in the newsroom</li>
                                </ul>
                              ) : null}
                            </div>

                            <div className={styles.editorialNote}>
                              <strong>Editorial Note</strong>
                              <p>
                                Your release will be reviewed by our editorial team within 48 hours. You will receive
                                an email with feedback or confirmation before distribution begins.
                              </p>
                            </div>
                          </div>
                        ) : null}

                        {step.nextLabel ? (
                          <div className={styles.stepFooter}>
                            <Button
                              type="button"
                              size="md"
                              className={styles.nextStepButton}
                              onClick={goToNextStep}
                            >
                              <span>Next: {step.nextLabel}</span>
                              <span className={styles.nextStepButtonIcon} aria-hidden>
                                <SvgIcon icon="right-arrow-large" />
                              </span>
                            </Button>
                          </div>
                        ) : null}
                        </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}

            </form>
          </div>

          <aside className={styles.summaryColumn}>
            <section className={styles.summaryCard}>
              <header className={styles.summaryHeader}>
                <span className={styles.summaryEyebrow}>Order Summary</span>
                <h2>{summaryHeading}</h2>
              </header>

              <div className={styles.summaryBody}>
                {!hasUsableCredits ? (
                  <div className={styles.packagePicker}>
                    <span className={styles.packagePickerLabel}>Select package</span>
                    <div className={styles.packageList}>
                      {packageOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`${styles.packageOption} ${selectedPackage === option.id ? styles.packageOptionActive : ""}`}
                          onClick={() => setSelectedPackage(option.id)}
                          disabled={submitFormPaused}
                        >
                          <strong>{option.title}</strong>
                          <span>{option.subtitle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`${styles.walletCreditCard} ${isFeaturedPlacementEnabled ? styles.walletCreditCardDivider : ""}`}>
                    <p>This submission will use <strong>1 credit</strong>.</p>
                  </div>
                )}

                {!hasUsableCredits ? (
                  <div className={`${styles.packageRow} ${isFeaturedPlacementEnabled ? styles.packageRowDivider : ""}`}>
                    <div className={styles.packageInfo}>
                      <strong>{selectedPackageData.title}</strong>
                      <span>{selectedPackageData.subtitle}</span>
                    </div>
                    <strong className={styles.packagePrice}>
                      {selectedPackageData.price === null
                        ? "Contact us"
                        : formatCurrency(selectedPackageData.price)}
                    </strong>
                  </div>
                ) : null}

                {isFeaturedPlacementEnabled ? (
                  <div className={styles.summaryRow}>
                    <span>Featured placement</span>
                    <span>{formatCurrency(featuredPlacementPrice)}</span>
                  </div>
                ) : null}

                <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
                  <strong>{summaryTotalLabel}</strong>
                  <strong>{summaryTotalValue}</strong>
                </div>

                <Button
                  type="submit"
                  form="submit-your-press-release-form"
                  size="md"
                  className={styles.submitButton}
                  disabled={
                    isSubmitting
                    || submitFormPaused
                    || (selectedPackage !== "custom"
                      && (isOverWordLimit
                        || isOverTitleLimit
                        || isOverSummaryLimit
                        || Boolean(fieldErrors.coverPhoto || fieldErrors.document || fieldErrors.outboundLink)))
                  }
                >
                  <span className={styles.submitButtonContent}>
                    <Send size={18} strokeWidth={2} aria-hidden />
                    {submitButtonLabel}
                  </span>
                </Button>

                {showPaymentNote && !submitFormPaused ? (
                  <p className={styles.paymentNote}>
                    You will be taken to payment after submitting
                  </p>
                ) : null}

                <ul className={styles.highlightList}>
                  {sidebarHighlightItems.map((item) => (
                    <li key={item}>
                      <Check size={16} strokeWidth={2.2} aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {hasUsableCredits || purchasingCredits ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className={styles.previewButton}
                    disabled={isSubmitting || submitFormPaused}
                    onClick={() => openPreview()}
                  >
                    Preview submission
                  </Button>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </Container>
    </section>
  );
}
