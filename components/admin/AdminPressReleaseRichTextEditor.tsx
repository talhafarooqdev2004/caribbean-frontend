"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import styles from "./AdminPressReleaseRichTextEditor.module.scss";

type AdminPressReleaseRichTextEditorProps = {
    releaseId: string;
    initialHtml: string;
    disabled?: boolean;
    onChange: (html: string) => void;
};

export function AdminPressReleaseRichTextEditor({
    releaseId,
    initialHtml,
    disabled,
    onChange,
}: AdminPressReleaseRichTextEditorProps) {
    const editor = useEditor(
        {
            immediatelyRender: false,
            extensions: [
                StarterKit.configure({
                    heading: { levels: [2, 3] },
                    code: false,
                    codeBlock: false,
                    horizontalRule: false,
                }),
                Link.configure({
                    openOnClick: false,
                    autolink: true,
                    linkOnPaste: true,
                    HTMLAttributes: {
                        rel: "noopener noreferrer",
                        target: "_blank",
                    },
                }),
                Placeholder.configure({
                    placeholder: "Press release body…",
                }),
            ],
            content: initialHtml,
            editable: !disabled,
            editorProps: {
                attributes: {
                    class: styles.proseMirror,
                    spellcheck: "true",
                },
            },
            onUpdate: ({ editor: ed }) => {
                onChange(ed.getHTML());
            },
        },
        [releaseId],
    );

    useEffect(() => {
        if (!editor) {
            return;
        }

        editor.setEditable(!disabled);
    }, [editor, disabled]);

    if (!editor) {
        return null;
    }

    function setLink() {
        if (!editor) {
            return;
        }

        const previous = editor.getAttributes("link").href as string | undefined;
        const next = window.prompt("Link URL (https://…)", previous ?? "https://");

        if (next === null) {
            return;
        }

        const trimmed = next.trim();

        if (trimmed === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();

            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
    }

    return (
        <div id="edit-release-content">
            <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
                <button
                    type="button"
                    className={`${styles.toolbarButton} ${editor.isActive("bold") ? styles.toolbarButtonActive : ""}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled || !editor.can().chain().focus().toggleBold().run()}
                >
                    Bold
                </button>
                <button
                    type="button"
                    className={`${styles.toolbarButton} ${editor.isActive("italic") ? styles.toolbarButtonActive : ""}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled || !editor.can().chain().focus().toggleItalic().run()}
                >
                    Italic
                </button>
                <button
                    type="button"
                    className={`${styles.toolbarButton} ${editor.isActive("heading", { level: 2 }) ? styles.toolbarButtonActive : ""}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    disabled={disabled}
                >
                    H2
                </button>
                <button
                    type="button"
                    className={`${styles.toolbarButton} ${editor.isActive("heading", { level: 3 }) ? styles.toolbarButtonActive : ""}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    disabled={disabled}
                >
                    H3
                </button>
                <button
                    type="button"
                    className={`${styles.toolbarButton} ${editor.isActive("bulletList") ? styles.toolbarButtonActive : ""}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                >
                    List
                </button>
                <button
                    type="button"
                    className={`${styles.toolbarButton} ${editor.isActive("orderedList") ? styles.toolbarButtonActive : ""}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={disabled}
                >
                    1. List
                </button>
                <button
                    type="button"
                    className={`${styles.toolbarButton} ${editor.isActive("blockquote") ? styles.toolbarButtonActive : ""}`}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    disabled={disabled}
                >
                    Quote
                </button>
                <button type="button" className={styles.toolbarButton} onClick={() => setLink()} disabled={disabled}>
                    Link
                </button>
                <button
                    type="button"
                    className={styles.toolbarButton}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={disabled || !editor.can().chain().focus().undo().run()}
                >
                    Undo
                </button>
                <button
                    type="button"
                    className={styles.toolbarButton}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={disabled || !editor.can().chain().focus().redo().run()}
                >
                    Redo
                </button>
            </div>

            <div className={`${styles.editorShell} ${disabled ? styles.editorShellDisabled : ""}`}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
