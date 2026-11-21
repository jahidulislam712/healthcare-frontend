"use client";

import { Button } from "@/components/ui/button";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import type { ReactNode } from "react";

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={active ? "secondary" : "ghost"}
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: JSONContent | string;
  onChange: (html: string, json: JSONContent) => void;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ link: { openOnClick: false } })],
    content,
    editorProps: {
      attributes: {
        "aria-label": "Page content",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML(), currentEditor.getJSON());
    },
  });

  const toggleLinkEditor = () => {
    if (!editor) return;
    setLinkUrl(editor.getAttributes("link").href ?? "");
    setLinkOpen((open) => !open);
  };

  const applyLink = () => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkOpen(false);
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div
        className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2"
        role="toolbar"
        aria-label="Page content formatting"
      >
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={editor?.isActive("strike")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton
          label="Heading 1"
          active={editor?.isActive("heading", { level: 1 })}
          disabled={!editor}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={!editor}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor?.isActive("bulletList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor?.isActive("orderedList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolbarButton>
        <ToolbarButton
          label="Block quote"
          active={editor?.isActive("blockquote")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </ToolbarButton>
        <ToolbarButton
          label="Inline code"
          active={editor?.isActive("code")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <Code />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          active={editor?.isActive("link")}
          disabled={!editor}
          onClick={toggleLinkEditor}
        >
          <Link2 />
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton
          label="Undo"
          disabled={!editor || !editor.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor || !editor.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 />
        </ToolbarButton>
      </div>

      {linkOpen && (
        <div className="flex gap-2 border-b p-3">
          <input
            autoFocus
            type="url"
            className="h-9 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm"
            placeholder="https://example.com"
            aria-label="Link URL"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
          />
          <Button type="button" size="sm" onClick={applyLink}>
            Apply
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setLinkOpen(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="min-h-[420px] [&_.tiptap]:min-h-[420px] [&_.tiptap]:p-5 [&_.tiptap]:outline-none [&_.tiptap_blockquote]:my-4 [&_.tiptap_blockquote]:border-l-2 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_h1]:my-5 [&_.tiptap_h1]:text-3xl [&_.tiptap_h1]:font-bold [&_.tiptap_h2]:my-4 [&_.tiptap_h2]:text-2xl [&_.tiptap_h2]:font-semibold [&_.tiptap_ol]:my-3 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_p]:my-3 [&_.tiptap_ul]:my-3 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6"
      />
      <div className="border-t px-4 py-2 text-xs text-muted-foreground">
        Use the toolbar to format page content.
      </div>
    </div>
  );
}
