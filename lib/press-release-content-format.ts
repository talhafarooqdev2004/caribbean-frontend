/**
 * Detect stored press release body that was saved as HTML (e.g. from the admin editor).
 * Plain user submissions stay plain text until an admin saves rich HTML.
 */
export function isRichHtmlContent(content: string): boolean {
    const t = content.trim();
    if (!t.includes("<") || !t.includes(">")) {
        return false;
    }

    return /<\s*(p|br|strong|em|b|i|u|ul|ol|li|a|h[1-6]|blockquote|div)\b/i.test(t);
}

export function escapeHtmlForEditor(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** Load plain DB text into TipTap as simple paragraphs (preserves single newlines as <br>). */
export function plainTextToEditorHtml(content: string): string {
    const t = content.trim();
    if (!t) {
        return "<p></p>";
    }

    const paragraphs = t.split(/\n{2,}|\r\n{2,}/).map((p) => p.trim()).filter(Boolean);
    if (paragraphs.length === 0) {
        return "<p></p>";
    }

    return paragraphs
        .map((p) => `<p>${escapeHtmlForEditor(p).replace(/\n/g, "<br>")}</p>`)
        .join("");
}

export function editorInitialHtmlFromStored(content: string): string {
    const t = content.trim();
    if (!t) {
        return "<p></p>";
    }

    if (isRichHtmlContent(t)) {
        return t;
    }

    return plainTextToEditorHtml(t);
}
