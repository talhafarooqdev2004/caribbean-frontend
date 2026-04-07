import { initialEnquiryValues, roleOptions, territoryOptions, type EnquiryFormValues } from "./enquiry-options";

export type EnquiryErrors = Partial<Record<keyof EnquiryFormValues, string>> & {
    form?: string;
};

const roleValues = new Set<string>(roleOptions.map((option) => option.value));
const territoryValues = new Set<string>(territoryOptions.map((option) => option.value));

const fieldLengthLimits = {
    firstName: 80,
    lastName: 80,
    email: 254,
    publicationName: 140,
    role: 80,
    coverageArea: 160,
    region: 80,
    website: 200,
    notes: 1000,
} as const;

function normalizeText(value: unknown) {
    return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function normalizeOptionalUrl(rawValue: string) {
    if (!rawValue) {
        return "";
    }

    const withProtocol = /^https?:\/\//i.test(rawValue) ? rawValue : `https://${rawValue}`;

    try {
        const url = new URL(withProtocol);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return "";
        }

        return url.toString();
    } catch {
        return "";
    }
}

function validateLength(field: keyof EnquiryFormValues, value: string, errors: EnquiryErrors) {
    if (value.length > fieldLengthLimits[field]) {
        errors[field] = `Please keep this under ${fieldLengthLimits[field]} characters.`;
    }
}

export function validateEnquiryInput(input: Partial<EnquiryFormValues>) {
    const values: EnquiryFormValues = {
        firstName: normalizeText(input.firstName),
        lastName: normalizeText(input.lastName),
        email: normalizeText(input.email).toLowerCase(),
        publicationName: normalizeText(input.publicationName),
        role: normalizeText(input.role),
        coverageArea: normalizeText(input.coverageArea),
        region: normalizeText(input.region),
        website: normalizeOptionalUrl(normalizeText(input.website)),
        notes: normalizeText(input.notes),
    };

    const errors: EnquiryErrors = {};

    if (!values.firstName) {
        errors.firstName = "First name is required.";
    }

    if (!values.lastName) {
        errors.lastName = "Last name is required.";
    }

    if (!values.email) {
        errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!values.publicationName) {
        errors.publicationName = "Publication / outlet name is required.";
    }

    if (!values.role) {
        errors.role = "Please select a role.";
    } else if (!roleValues.has(values.role)) {
        errors.role = "Please select a valid role.";
    }

    if (!values.region) {
        errors.region = "Please select a region.";
    } else if (!territoryValues.has(values.region)) {
        errors.region = "Please select a valid region.";
    }

    validateLength("firstName", values.firstName, errors);
    validateLength("lastName", values.lastName, errors);
    validateLength("email", values.email, errors);
    validateLength("publicationName", values.publicationName, errors);
    validateLength("role", values.role, errors);
    validateLength("coverageArea", values.coverageArea, errors);
    validateLength("region", values.region, errors);
    validateLength("website", values.website, errors);
    validateLength("notes", values.notes, errors);

    if (input.website && !values.website) {
        errors.website = "Enter a valid website URL.";
    }

    if (input.coverageArea && input.coverageArea.length > fieldLengthLimits.coverageArea) {
        errors.coverageArea = `Please keep this under ${fieldLengthLimits.coverageArea} characters.`;
    }

    if (input.notes && input.notes.length > fieldLengthLimits.notes) {
        errors.notes = `Please keep this under ${fieldLengthLimits.notes} characters.`;
    }

    const hasErrors = Object.keys(errors).length > 0;

    return {
        values: hasErrors ? null : values,
        errors,
    };
}

export function getEmptyEnquiryValues() {
    return { ...initialEnquiryValues };
}
