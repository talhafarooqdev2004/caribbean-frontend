import { formatApiValidationErrors, apiValidationErrorsByField } from "./format-api-validation-errors";

export const CHECKOUT_SESSION_EXPIRED_MESSAGE =
    "Your session expired. Please sign in and try again.";

const AUTH_ERROR_PATTERN = /authentication token required|invalid or expired token/i;
const UPLOAD_ERROR_PATTERN = /cover image|document must|too large|uploaded file is too large|5mb|10mb/i;

export function resolveCheckoutStartError(
    payload: Record<string, unknown> | null,
    status: number,
): string {
    const fieldErrors = apiValidationErrorsByField(payload);

    if (fieldErrors.coverPhoto) {
        return fieldErrors.coverPhoto;
    }

    if (fieldErrors.document) {
        return fieldErrors.document;
    }

    const fromApi = formatApiValidationErrors(payload, "");

    if (fromApi && AUTH_ERROR_PATTERN.test(fromApi)) {
        return CHECKOUT_SESSION_EXPIRED_MESSAGE;
    }

    if (fromApi && UPLOAD_ERROR_PATTERN.test(fromApi)) {
        return fromApi.replace(/^Cover image:\s*/i, "").trim() || fromApi;
    }

    if (fromApi) {
        return fromApi;
    }

    if (status === 401) {
        return CHECKOUT_SESSION_EXPIRED_MESSAGE;
    }

    if (status === 400 || status === 413) {
        return "Your cover image must be JPG, PNG, or WebP and under 5MB. Documents must be under 10MB.";
    }

    if (status === 409) {
        return "That headline is already in use. Change your release title slightly and try again.";
    }

    if (status === 429) {
        return "Too many attempts. Please wait a few minutes and try again.";
    }

    if (status >= 500) {
        return "Our server had trouble starting checkout. Please try again in a few minutes.";
    }

    return "We could not start checkout. Please check your entries and try again.";
}
