import DOMPurify from "isomorphic-dompurify";

const SANITIZE_OPTIONS: Parameters<typeof DOMPurify.sanitize>[1] = {
    ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "h2",
        "h3",
        "ul",
        "ol",
        "li",
        "a",
        "blockquote",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
};

export function sanitizePressReleaseHtml(html: string): string {
    return DOMPurify.sanitize(html, SANITIZE_OPTIONS);
}
