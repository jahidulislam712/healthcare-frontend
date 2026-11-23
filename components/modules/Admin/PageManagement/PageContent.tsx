import { Fragment } from "react";
import type { ReactNode } from "react";
import Image from "next/image";

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

interface BlockNoteBlock {
  id?: string;
  type: string;
  props?: Record<string, unknown>;
  content?: unknown;
  children?: BlockNoteBlock[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBlockNoteBlock(value: unknown): value is BlockNoteBlock {
  return (
    isRecord(value) &&
    typeof value.type === "string" &&
    (value.props === undefined || isRecord(value.props)) &&
    (value.children === undefined ||
      (Array.isArray(value.children) && value.children.every(isBlockNoteBlock)))
  );
}

function isBlockNoteDocument(value: unknown): value is BlockNoteBlock[] {
  return Array.isArray(value) && value.length > 0 && value.every(isBlockNoteBlock);
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

function renderBlockNoteInline(content: unknown, keyPrefix: string): ReactNode {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return null;

  return content.map((item, index) => {
    if (!isRecord(item) || typeof item.type !== "string") return null;

    const itemKey = `${keyPrefix}-${index}`;
    if (item.type === "link") {
      const children = renderBlockNoteInline(item.content, itemKey);
      const href = safeHref(item.href);
      return href ? (
        <a key={itemKey} href={href}>
          {children}
        </a>
      ) : (
        <Fragment key={itemKey}>{children}</Fragment>
      );
    }

    let text: ReactNode = typeof item.text === "string" ? item.text : "";
    const styles = isRecord(item.styles) ? item.styles : {};
    if (styles.code === true) text = <code>{text}</code>;
    if (styles.strike === true) text = <s>{text}</s>;
    if (styles.underline === true) text = <u>{text}</u>;
    if (styles.italic === true) text = <em>{text}</em>;
    if (styles.bold === true) text = <strong>{text}</strong>;

    return <Fragment key={itemKey}>{text}</Fragment>;
  });
}

function renderBlockNoteTable(block: BlockNoteBlock, key: string): ReactNode {
  if (!isRecord(block.content) || !Array.isArray(block.content.rows)) {
    return null;
  }

  const headerRows =
    typeof block.content.headerRows === "number" ? block.content.headerRows : 0;
  const headerCols =
    typeof block.content.headerCols === "number" ? block.content.headerCols : 0;

  return (
    <div key={key} className="overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {block.content.rows.map((row, rowIndex) => {
            const cells = isRecord(row) && Array.isArray(row.cells) ? row.cells : [];
            return (
              <tr key={`${key}-row-${rowIndex}`}>
                {cells.map((cell, cellIndex) => {
                  const cellContent = Array.isArray(cell)
                    ? cell
                    : isRecord(cell)
                      ? cell.content
                      : undefined;
                  const isHeader =
                    rowIndex < headerRows || cellIndex < headerCols;
                  const cellKey = `${key}-cell-${rowIndex}-${cellIndex}`;

                  return isHeader ? (
                    <th
                      key={cellKey}
                      className="border px-3 py-2 text-left font-semibold"
                    >
                      {renderBlockNoteInline(cellContent, cellKey)}
                    </th>
                  ) : (
                    <td key={cellKey} className="border px-3 py-2">
                      {renderBlockNoteInline(cellContent, cellKey)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderBlockNoteList(
  blocks: BlockNoteBlock[],
  startIndex: number,
  key: string,
): { node: ReactNode; nextIndex: number } {
  const type = blocks[startIndex].type;
  const group: BlockNoteBlock[] = [];
  let nextIndex = startIndex;

  while (nextIndex < blocks.length && blocks[nextIndex].type === type) {
    group.push(blocks[nextIndex]);
    nextIndex += 1;
  }

  const items = group.map((block, index) => {
    const itemKey = `${key}-item-${index}`;
    const children = renderBlockNoteBlocks(block.children ?? [], itemKey);
    const content = renderBlockNoteInline(block.content, itemKey);

    if (type === "checkListItem") {
      return (
        <li key={itemKey} className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={block.props?.checked === true}
            readOnly
            aria-label="Checklist item"
          />
          <div>
            {content}
            {children}
          </div>
        </li>
      );
    }

    return (
      <li key={itemKey}>
        <div>{content}</div>
        {children}
      </li>
    );
  });

  if (type === "numberedListItem") {
    return {
      node: <ol key={key}>{items}</ol>,
      nextIndex,
    };
  }

  return {
    node: <ul key={key}>{items}</ul>,
    nextIndex,
  };
}

function renderBlockNoteBlocks(
  blocks: BlockNoteBlock[],
  keyPrefix = "blocknote",
): ReactNode[] {
  const rendered: ReactNode[] = [];

  for (let index = 0; index < blocks.length; ) {
    const block = blocks[index];
    const key = `${keyPrefix}-${block.id ?? index}`;

    if (
      block.type === "bulletListItem" ||
      block.type === "numberedListItem" ||
      block.type === "checkListItem"
    ) {
      const list = renderBlockNoteList(blocks, index, key);
      rendered.push(list.node);
      index = list.nextIndex;
      continue;
    }

    const content = renderBlockNoteInline(block.content, key);
    const children = renderBlockNoteBlocks(block.children ?? [], key);

    switch (block.type) {
      case "paragraph":
        rendered.push(
          <Fragment key={key}>
            <p>{content}</p>
            {children}
          </Fragment>,
        );
        break;
      case "heading": {
        const level = Number(block.props?.level);
        const heading =
          level === 1 ? (
            <h1>{content}</h1>
          ) : level === 2 ? (
            <h2>{content}</h2>
          ) : level === 3 ? (
            <h3>{content}</h3>
          ) : level === 4 ? (
            <h4>{content}</h4>
          ) : level === 5 ? (
            <h5>{content}</h5>
          ) : level === 6 ? (
            <h6>{content}</h6>
          ) : (
            <p>{content}</p>
          );
        rendered.push(
          <Fragment key={key}>
            {heading}
            {children}
          </Fragment>,
        );
        break;
      }
      case "quote":
        rendered.push(
          <blockquote key={key}>
            {content}
            {children}
          </blockquote>,
        );
        break;
      case "codeBlock":
        rendered.push(
          <pre key={key}>
            <code>
              {typeof block.content === "string"
                ? block.content
                : content}
            </code>
          </pre>,
        );
        break;
      case "divider":
        rendered.push(<hr key={key} />);
        break;
      case "table":
        rendered.push(renderBlockNoteTable(block, key));
        break;
      case "image": {
        const src = safeResourceUrl(block.props?.url);
        if (!src) break;
        const width =
          typeof block.props?.previewWidth === "number" &&
          block.props.previewWidth > 0
            ? Math.round(block.props.previewWidth)
            : 1200;
        rendered.push(
          <figure key={key}>
            <Image
              src={src}
              alt={
                typeof block.props?.caption === "string"
                  ? block.props.caption
                  : typeof block.props?.name === "string"
                    ? block.props.name
                    : ""
              }
              width={width}
              height={Math.round((width * 2) / 3)}
              unoptimized
              className="h-auto max-w-full rounded-md"
            />
            {typeof block.props?.caption === "string" &&
              block.props.caption && (
                <figcaption className="mt-2 text-sm text-muted-foreground">
                  {block.props.caption}
                </figcaption>
              )}
          </figure>,
        );
        break;
      }
      case "video":
      case "audio":
      case "file": {
        const href = safeResourceUrl(block.props?.url);
        if (!href) break;
        const label =
          typeof block.props?.name === "string" && block.props.name
            ? block.props.name
            : `Open ${block.type}`;
        rendered.push(
          <a key={key} href={href} className="text-primary underline">
            {label}
          </a>,
        );
        break;
      }
      default:
        rendered.push(
          <Fragment key={key}>
            {content}
            {children}
          </Fragment>,
        );
    }

    index += 1;
  }

  return rendered;
}

export default function PageContent({
  contentJson,
  fallback,
}: {
  contentJson: unknown;
  fallback: string;
}) {
  if (isBlockNoteDocument(contentJson)) {
    return (
      <div className="page-content space-y-4 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_table]:text-left [&_ul]:list-disc">
        {renderBlockNoteBlocks(contentJson)}
      </div>
    );
  }

  if (isContentNode(contentJson) && contentJson.type === "doc") {
    return (
      <div className="page-content space-y-4 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_ul]:list-disc">
        {renderNode(contentJson, 0)}
      </div>
    );
  }

  return <div className="whitespace-pre-wrap">{fallback}</div>;
}
