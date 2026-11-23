"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  content: unknown;
  onChange: (json: PartialBlock[], html: string) => void;
}

interface LegacyMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface LegacyNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: LegacyNode[];
  marks?: LegacyMark[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLegacyNode(value: unknown): value is LegacyNode {
  if (!isRecord(value)) return false;

  return (
    (value.type === undefined || typeof value.type === "string") &&
    (value.text === undefined || typeof value.text === "string") &&
    (value.attrs === undefined || isRecord(value.attrs)) &&
    (value.content === undefined ||
      (Array.isArray(value.content) && value.content.every(isLegacyNode))) &&
    (value.marks === undefined ||
      (Array.isArray(value.marks) &&
        value.marks.every(
          (mark) =>
            isRecord(mark) &&
            typeof mark.type === "string" &&
            (mark.attrs === undefined || isRecord(mark.attrs)),
        )))
  );
}

function isLegacyDocument(value: unknown): value is LegacyNode {
  return (
    isRecord(value) &&
    value.type === "doc" &&
    Array.isArray(value.content) &&
    value.content.every(isLegacyNode)
  );
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function safeHref(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? value
      : null;
  } catch {
    return null;
  }
}

function safeResourceUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}

function renderLegacyNode(node: LegacyNode): string {
  if (node.type === "text") {
    let html = escapeHtml(node.text ?? "");

    for (const mark of node.marks ?? []) {
      switch (mark.type) {
        case "bold":
          html = `<strong>${html}</strong>`;
          break;
        case "italic":
          html = `<em>${html}</em>`;
          break;
        case "strike":
          html = `<s>${html}</s>`;
          break;
        case "code":
          html = `<code>${html}</code>`;
          break;
        case "underline":
          html = `<u>${html}</u>`;
          break;
        case "subscript":
          html = `<sub>${html}</sub>`;
          break;
        case "superscript":
          html = `<sup>${html}</sup>`;
          break;
        case "link": {
          const href = safeHref(mark.attrs?.href);
          if (href) html = `<a href="${escapeHtml(href)}">${html}</a>`;
          break;
        }
      }
    }

    return html;
  }

  const children = (node.content ?? []).map(renderLegacyNode).join("");

  switch (node.type) {
    case "doc":
      return children;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading": {
      const level =
        typeof node.attrs?.level === "number" &&
        node.attrs.level >= 1 &&
        node.attrs.level <= 3
          ? node.attrs.level
          : 1;
      return `<h${level}>${children}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList": {
      const start = node.attrs?.start;
      const startAttribute =
        typeof start === "number" && start > 1 ? ` start="${start}"` : "";
      return `<ol${startAttribute}>${children}</ol>`;
    }
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children}</code></pre>`;
    case "horizontalRule":
      return "<hr>";
    case "hardBreak":
      return "<br>";
    case "image": {
      const src = safeResourceUrl(node.attrs?.src);
      if (!src) return "";
      const alt =
        typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
    }
    default:
      return children;
  }
}

function isBlockNoteDocument(value: unknown): value is PartialBlock[] {
  return (
    Array.isArray(value) &&
    value.every(
      (block) =>
        isRecord(block) && typeof block.type === "string",
    )
  );
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const [initialContent] = useState(() => content);

  const initialBlocks = isBlockNoteDocument(initialContent)
    ? initialContent
    : undefined;
  const lastLoadedContent = useRef(
    initialBlocks || initialContent == null ? initialContent : undefined,
  );

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  const [contentReady, setContentReady] = useState(
    initialBlocks !== undefined || initialContent == null,
  );

  const [loadError, setLoadError] = useState(false);

  // Load BlockNote JSON, legacy TipTap JSON, or HTML when external content changes.
  useEffect(() => {
    if (content === lastLoadedContent.current) return;

    let cancelled = false;

    const loadContent = async () => {
      try {
        setContentReady(false);
        setLoadError(false);

        let blocks: PartialBlock[];

        if (content == null) {
          blocks = [];
        } else if (isBlockNoteDocument(content)) {
          blocks = content;
        } else if (typeof content === "string" && content?.trim()) {
          blocks = await editor.tryParseHTMLToBlocks(content);
        } else if (typeof content === "string") {
          blocks = [];
        } else if (isLegacyDocument(content)) {
          const html = renderLegacyNode(content);
          blocks = await editor.tryParseHTMLToBlocks(html);
        } else {
          throw new Error("Unsupported page content format.");
        }

        if (cancelled) return;

        editor.replaceBlocks(editor.document, blocks);

        lastLoadedContent.current = blocks;
        setContentReady(true);

        // Synchronize the converted content with the parent.
        onChange(blocks, editor.blocksToHTMLLossy(blocks));
      } catch (error) {
        if (cancelled) return;

        console.error("Page content import failed:", error);
        setLoadError(true);
      }
    };

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [content, editor, onChange]);

  // Handle user edits.
  const handleChange = () => {
    const blocks = editor.document;

    lastLoadedContent.current = blocks;
    onChange(blocks, editor.blocksToHTMLLossy(blocks));
  };

  return (
    <div
      className="rounded-lg border bg-background"
      aria-busy={!contentReady && !loadError}
    >
      {loadError ? (
        <p className="p-4 text-sm text-destructive" role="alert">
          Could not load existing page content. Reload the page before editing.
        </p>
      ) : contentReady ? (
        <BlockNoteView
          editor={editor}
          onChange={handleChange}
          className="min-h-105 [&_.bn-editor]:min-h-105"
        />
      ) : (
        <p className="p-4 text-sm text-muted-foreground" role="status">
          Loading page content...
        </p>
      )}
    </div>
  );
}
