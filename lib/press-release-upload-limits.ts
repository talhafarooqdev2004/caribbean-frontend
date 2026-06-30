export const COVER_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;

export const COVER_PHOTO_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
export const DOCUMENT_ACCEPT =
    ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const COVER_PHOTO_UPLOAD_HINT =
    "JPG, PNG or WebP • Max 5MB • Recommended at least 1200px wide (landscape)";

export const DOCUMENT_UPLOAD_HINT = "PDF, DOC or DOCX • Max 10MB";

const COVER_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOCUMENT_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function formatUploadSizeLimit(bytes: number): string {
    const megabytes = bytes / (1024 * 1024);

    if (megabytes >= 1) {
        return `${Math.round(megabytes)}MB`;
    }

    return `${Math.round(bytes / 1024)}KB`;
}

export function validateCoverPhotoFile(file: File): string | null {
    if (!COVER_PHOTO_TYPES.includes(file.type)) {
        return "Cover image must be a JPG, PNG, or WebP file.";
    }

    if (file.size > COVER_PHOTO_MAX_BYTES) {
        return `Cover image must be under ${formatUploadSizeLimit(COVER_PHOTO_MAX_BYTES)}.`;
    }

    return null;
}

export function validateDocumentFile(file: File): string | null {
    if (!DOCUMENT_TYPES.includes(file.type)) {
        return "Document must be a PDF, DOC, or DOCX file.";
    }

    if (file.size > DOCUMENT_MAX_BYTES) {
        return `Document must be under ${formatUploadSizeLimit(DOCUMENT_MAX_BYTES)}.`;
    }

    return null;
}
