"use client";

import {
  CreatePagePayload,
  IPage,
  PageLayout,
  PageStatus,
  UpdatePagePayload,
} from "@/app/types/page.types";
import { IMediaAsset } from "@/app/types/media.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "./RichTextEditor";
import { createPage, getPages, updatePage } from "@/services/page.services";
import { MediaSelectModal } from "@/components/modules/Media/MediaSelectModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { JSONContent } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, X, UploadCloud, Sparkles } from "lucide-react";
import Image from "next/image";

interface PageFormValues {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: string;
  contentJson: JSONContent | null;
  layout: PageLayout;
  status: PageStatus;
  parentId: string;
  orderIndex: string;
  thumbnailId: string | null;
  thumbnailMedia: IMediaAsset | null;
  ogImageId: string | null;
  ogImageMedia: IMediaAsset | null;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  scheduledAt: string;
  noIndex: boolean;
}

const pageLayouts: PageLayout[] = [
  "DEFAULT",
  "FULL_WIDTH",
  "LANDING",
  "LEGAL",
  "HELP_CENTER",
  "CUSTOM",
];

const pageStatuses: PageStatus[] = [
  "DRAFT",
  "IN_REVIEW",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
];

function toLocalDateTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function isEditorDocument(value: unknown): value is JSONContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "doc"
  );
}

function getInitialValues(page?: IPage): PageFormValues {
  return {
    title: page?.title ?? "",
    slug: page?.slug ?? "",
    subtitle: page?.subtitle ?? "",
    excerpt: page?.excerpt ?? "",
    content: page?.content ?? "",
    contentJson: isEditorDocument(page?.contentJson)
      ? page.contentJson
      : null,
    layout: page?.layout ?? "DEFAULT",
    status: page?.status ?? "DRAFT",
    parentId: page?.parentId ?? "",
    orderIndex: String(page?.orderIndex ?? 0),
    thumbnailId: page?.thumbnailId ?? null,
    thumbnailMedia: page?.thumbnailMedia ?? null,
    ogImageId: page?.ogImageId ?? null,
    ogImageMedia: page?.ogImageMedia ?? null,
    metaTitle: page?.metaTitle ?? "",
    metaDescription: page?.metaDescription ?? "",
    canonicalUrl: page?.canonicalUrl ?? "",
    scheduledAt: toLocalDateTime(page?.scheduledAt),
    noIndex: page?.noIndex ?? false,
  };
}

export default function PageForm({
  page,
  onSaved,
}: {
  page?: IPage;
  onSaved?: () => void;
}) {
  const [values, setValues] = useState(() => getInitialValues(page));
  const [contentError, setContentError] = useState(false);
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);
  const [isOgModalOpen, setIsOgModalOpen] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: pagesResult,
    isError: parentPagesError,
    error: parentPagesErrorMessage,
  } = useQuery({
    queryKey: ["admin-pages-parent-options"],
    queryFn: () => getPages({ limit: 100, sortBy: "title", sortOrder: "asc" }),
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: async (formValues: PageFormValues) => {
      const title = formValues.title.trim();
      const slug = formValues.slug.trim() || undefined;
      const orderIndex = Number(formValues.orderIndex) || 0;

      if (page) {
        const payload: UpdatePagePayload = {
          title,
          slug,
          subtitle: formValues.subtitle.trim() || null,
          excerpt: formValues.excerpt.trim() || null,
          content: formValues.content,
          ...(formValues.contentJson
            ? { contentJson: formValues.contentJson }
            : {}),
          layout: formValues.layout,
          status: formValues.status,
          parentId: formValues.parentId || null,
          orderIndex,
          thumbnailId: formValues.thumbnailId || null,
          ogImageId: formValues.ogImageId || null,
          metaTitle: formValues.metaTitle.trim() || null,
          metaDescription: formValues.metaDescription.trim() || null,
          canonicalUrl: formValues.canonicalUrl.trim() || null,
          scheduledAt: formValues.scheduledAt
            ? new Date(formValues.scheduledAt).toISOString()
            : null,
          noIndex: formValues.noIndex,
        };
        return updatePage(page.id, payload);
      }

      const payload: CreatePagePayload = {
        title,
        slug,
        ...(formValues.subtitle.trim()
          ? { subtitle: formValues.subtitle.trim() }
          : {}),
        ...(formValues.excerpt.trim()
          ? { excerpt: formValues.excerpt.trim() }
          : {}),
        content: formValues.content,
        ...(formValues.contentJson
          ? { contentJson: formValues.contentJson }
          : {}),
        layout: formValues.layout,
        status: formValues.status,
        parentId: formValues.parentId || null,
        orderIndex,
        thumbnailId: formValues.thumbnailId || null,
        ogImageId: formValues.ogImageId || null,
        ...(formValues.metaTitle.trim()
          ? { metaTitle: formValues.metaTitle.trim() }
          : {}),
        ...(formValues.metaDescription.trim()
          ? { metaDescription: formValues.metaDescription.trim() }
          : {}),
        canonicalUrl: formValues.canonicalUrl.trim() || null,
        scheduledAt: formValues.scheduledAt
          ? new Date(formValues.scheduledAt).toISOString()
          : null,
        noIndex: formValues.noIndex,
      };
      return createPage(payload);
    },
    onSuccess: async () => {
      toast.success(page ? "Page updated." : "Page created.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-pages"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin-pages-parent-options"],
        }),
      ]);
      if (onSaved) {
        onSaved();
      } else {
        router.push("/pages");
      }
    },
    onError: (error) => {
      console.error("Page save failed.", error);
      toast.error(error.message || "Unable to save page.");
    },
  });

  const updateField = <K extends keyof PageFormValues>(
    key: K,
    value: PageFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const parentPages = (pagesResult?.data ?? []).filter(
    (candidate) => !candidate.isDeleted && candidate.id !== page?.id,
  );

  return (
    <>
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!values.content.replace(/<[^>]*>/g, "").trim()) {
            setContentError(true);
            return;
          }
          mutation.mutate(values);
        }}
      >
        <label className="block space-y-2 rounded-xl border bg-card p-5 text-sm font-semibold shadow-sm">
          Page title
          <Input
            required
            maxLength={255}
            className="h-12 text-lg font-normal"
            placeholder="Enter page title"
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
        </label>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="space-y-6">
            <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
              <header>
                <h2 className="text-lg font-semibold">Page content</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Write and format content as it will appear on the published page.
                </p>
              </header>
              <RichTextEditor
                content={values.contentJson ?? values.content}
                onChange={(html, json) => {
                  updateField("content", html);
                  updateField("contentJson", json);
                  if (html.replace(/<[^>]*>/g, "").trim()) {
                    setContentError(false);
                  }
                }}
              />
              {contentError && (
                <p className="text-sm text-destructive" role="alert">
                  Add page content before saving.
                </p>
              )}
            </section>

            <section className="grid gap-4 rounded-xl border bg-card p-5 shadow-sm">
              <label className="space-y-1.5 text-sm font-medium">
                Subtitle
                <Input
                  maxLength={255}
                  value={values.subtitle}
                  onChange={(event) =>
                    updateField("subtitle", event.target.value)
                  }
                />
              </label>
              <label className="space-y-1.5 text-sm font-medium">
                Excerpt
                <Textarea
                  value={values.excerpt}
                  onChange={(event) =>
                    updateField("excerpt", event.target.value)
                  }
                />
              </label>
            </section>
          </main>

          <aside className="space-y-5">
            {/* Publish Actions */}
            <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
              <h2 className="font-semibold">Publish</h2>
              <label className="block space-y-1.5 text-sm font-medium">
                Status
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                  value={values.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as PageStatus)
                  }
                >
                  {pageStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              {values.status === "SCHEDULED" && (
                <label className="block space-y-1.5 text-sm font-medium">
                  Publish date
                  <Input
                    type="datetime-local"
                    required
                    value={values.scheduledAt}
                    onChange={(event) =>
                      updateField("scheduledAt", event.target.value)
                    }
                  />
                </label>
              )}
              {mutation.isError && (
                <p className="text-sm text-destructive" role="alert">
                  {mutation.error.message || "Unable to save page."}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending
                  ? "Saving..."
                  : page
                    ? "Save changes"
                    : "Create page"}
              </Button>
            </section>

            {/* Media Assignment Section */}
            <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                <h2 className="font-semibold">Featured Media</h2>
              </div>

              {/* Thumbnail Assignment */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  Page Featured Image
                </label>
                {values.thumbnailMedia ? (
                  <div className="relative group rounded-xl border border-border overflow-hidden bg-muted/40">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted/60">
                      <Image
                        height={167}
                        width={296}
                        src={values.thumbnailMedia.secureUrl || values.thumbnailMedia.url}
                        alt={values.thumbnailMedia.altText || "Thumbnail"}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="p-2.5 flex items-center justify-between gap-2 text-xs">
                      <span className="truncate font-medium text-foreground max-w-36" title={values.thumbnailMedia.fileName}>
                        {values.thumbnailMedia.fileName}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => setIsThumbnailModalOpen(true)}
                        >
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-xs"
                          onClick={() => {
                            updateField("thumbnailId", null);
                            updateField("thumbnailMedia", null);
                          }}
                          title="Remove image"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsThumbnailModalOpen(true)}
                    className="cursor-pointer rounded-xl border-2 border-dashed border-border p-4 text-center hover:border-primary/50 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ImageIcon className="size-4.5" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      Assign Featured Thumbnail
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Click to choose or upload from media library
                    </span>
                  </div>
                )}
              </div>

              {/* Social OG Image Assignment */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <label className="block text-xs font-semibold text-foreground">
                  Social Share (OG) Image
                </label>
                {values.ogImageMedia ? (
                  <div className="relative group rounded-xl border border-border overflow-hidden bg-muted/40">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted/60">
                      <Image
                              height={30}
                              width={30}
                        src={values.ogImageMedia.secureUrl || values.ogImageMedia.url}
                        alt={values.ogImageMedia.altText || "Social Image"}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="p-2.5 flex items-center justify-between gap-2 text-xs">
                      <span className="truncate font-medium text-foreground max-w-36" title={values.ogImageMedia.fileName}>
                        {values.ogImageMedia.fileName}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => setIsOgModalOpen(true)}
                        >
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-xs"
                          onClick={() => {
                            updateField("ogImageId", null);
                            updateField("ogImageMedia", null);
                          }}
                          title="Remove image"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsOgModalOpen(true)}
                    className="cursor-pointer rounded-xl border border-dashed border-border p-3 text-center hover:border-primary/50 hover:bg-muted/40 transition-colors flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground"
                  >
                    <UploadCloud className="size-4 text-primary" />
                    <span>Select Social Image (Optional)</span>
                  </div>
                )}
              </div>
            </section>

            {/* Page settings */}
            <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
              <h2 className="font-semibold">Page settings</h2>
              <label className="block space-y-1.5 text-sm font-medium">
                URL slug
                <Input
                  maxLength={255}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  placeholder="Generated from title"
                  value={values.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                Parent page
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                  value={values.parentId}
                  onChange={(event) =>
                    updateField("parentId", event.target.value)
                  }
                >
                  <option value="">No parent</option>
                  {parentPages.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.title}
                    </option>
                  ))}
                </select>
              </label>
              {parentPagesError && (
                <p className="text-sm text-destructive" role="alert">
                  Unable to load parent pages: {parentPagesErrorMessage.message}
                </p>
              )}
              <label className="block space-y-1.5 text-sm font-medium">
                Layout
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                  value={values.layout}
                  onChange={(event) =>
                    updateField("layout", event.target.value as PageLayout)
                  }
                >
                  {pageLayouts.map((layout) => (
                    <option key={layout} value={layout}>
                      {layout.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                Navigation order
                <Input
                  type="number"
                  step="1"
                  value={values.orderIndex}
                  onChange={(event) =>
                    updateField("orderIndex", event.target.value)
                  }
                />
              </label>
            </section>

            {/* Search appearance & SEO */}
            <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
              <h2 className="font-semibold">Search appearance</h2>
              <label className="block space-y-1.5 text-sm font-medium">
                Meta title
                <Input
                  maxLength={255}
                  value={values.metaTitle}
                  onChange={(event) =>
                    updateField("metaTitle", event.target.value)
                  }
                />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                Meta description
                <Textarea
                  value={values.metaDescription}
                  onChange={(event) =>
                    updateField("metaDescription", event.target.value)
                  }
                />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                Canonical URL
                <Input
                  type="url"
                  value={values.canonicalUrl}
                  onChange={(event) =>
                    updateField("canonicalUrl", event.target.value)
                  }
                />
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={values.noIndex}
                  onChange={(event) =>
                    updateField("noIndex", event.target.checked)
                  }
                />
                <span>Hide this page from search engines</span>
              </label>
            </section>
          </aside>
        </div>
      </form>

      {/* Featured Thumbnail Modal */}
      <MediaSelectModal
        open={isThumbnailModalOpen}
        onOpenChange={setIsThumbnailModalOpen}
        selectedId={values.thumbnailId}
        title="Assign Page Featured Image"
        description="Select an image from library or upload to display as featured banner for this page."
        onSelect={(asset) => {
          updateField("thumbnailId", asset.id);
          updateField("thumbnailMedia", asset);
        }}
      />

      {/* Social OG Image Modal */}
      <MediaSelectModal
        open={isOgModalOpen}
        onOpenChange={setIsOgModalOpen}
        selectedId={values.ogImageId}
        title="Assign Social Share (OG) Image"
        description="Select the preview card image when this page is shared on Twitter, Facebook, or LinkedIn."
        onSelect={(asset) => {
          updateField("ogImageId", asset.id);
          updateField("ogImageMedia", asset);
        }}
      />
    </>
  );
}
