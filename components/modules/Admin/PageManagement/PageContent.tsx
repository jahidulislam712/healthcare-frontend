import { Fragment } from "react";
import type { ReactNode } from "react";

interface ContentMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface ContentNode {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: ContentNode[];
  marks?: ContentMark[];
}

function isContentNode(value: unknown): value is ContentNode {
  if (typeof value !== "object" || value === null || !("type" in value)) {
    return false;
  }

  const node = value as Record<string, unknown>;
  const validAttributes =
    node.attrs === undefined ||
    (typeof node.attrs === "object" && node.attrs !== null);
  const validContent =
    node.content === undefined ||
    (Array.isArray(node.content) && node.content.every(isContentNode));
  const validMarks =
    node.marks === undefined ||
    (Array.isArray(node.marks) && node.marks.every(isContentMark));

  return (
    typeof node.type === "string" &&
    (node.text === undefined || typeof node.text === "string") &&
    validAttributes &&
    validContent &&
    validMarks
  );
}

function isContentMark(value: unknown): value is ContentMark {
  if (typeof value !== "object" || value === null || !("type" in value)) {
    return false;
  }

  const mark = value as Record<string, unknown>;
  return (
    typeof mark.type === "string" &&
    (mark.attrs === undefined ||
      (typeof mark.attrs === "object" && mark.attrs !== null))
  );
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

function renderText(node: ContentNode, key: number): ReactNode {
  let content: ReactNode = node.text ?? "";

  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case "bold":
        content = <strong>{content}</strong>;
        break;
      case "italic":
        content = <em>{content}</em>;
        break;
      case "strike":
        content = <s>{content}</s>;
        break;
      case "code":
        content = <code>{content}</code>;
        break;
      case "link": {
        const href = safeHref(mark.attrs?.href);
        if (href) content = <a href={href}>{content}</a>;
        break;
      }
    }
  }

  return <Fragment key={key}>{content}</Fragment>;
}

function renderNode(node: ContentNode, key: number): ReactNode {
  if (node.type === "text") return renderText(node, key);

  const children = (node.content ?? []).map((child, index) =>
    renderNode(child, index),
  );

  switch (node.type) {
    case "doc":
      return <Fragment key={key}>{children}</Fragment>;
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = Number(node.attrs?.level);
      switch (level) {
        case 1:
          return <h1 key={key}>{children}</h1>;
        case 2:
          return <h2 key={key}>{children}</h2>;
        case 3:
          return <h3 key={key}>{children}</h3>;
        case 4:
          return <h4 key={key}>{children}</h4>;
        case 5:
          return <h5 key={key}>{children}</h5>;
        case 6:
          return <h6 key={key}>{children}</h6>;
        default:
          return <p key={key}>{children}</p>;
      }
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    default:
      return <Fragment key={key}>{children}</Fragment>;
  }
}

export default function PageContent({
  contentJson,
  fallback,
}: {
  contentJson: unknown;
  fallback: string;
}) {
  if (isContentNode(contentJson) && contentJson.type === "doc") {
    return (
      <div className="page-content space-y-4 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_ul]:list-disc">
        {renderNode(contentJson, 0)}
      </div>
    );
  }

  return <div className="whitespace-pre-wrap">{fallback}</div>;
}
