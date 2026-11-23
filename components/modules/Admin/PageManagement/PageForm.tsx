"use client";

import {
  CreatePagePayload,
  IPage,
  PageContentJson,
  PageFormValues,
  PageLayout,
  PageStatus,
  UpdatePagePayload,
} from "@/app/types/page.types";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { createPage, getPages, updatePage } from "@/services/page.services";
import { MediaSelectModal } from "@/components/modules/Media/MediaSelectModal";
import RichTextEditor from "./RichTextEditor";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Image as ImageIcon, X, UploadCloud, Sparkles } from "lucide-react";
import Image from "next/image";
import type { PartialBlock } from "@blocknote/core";
import { useState, useEffect } from "react";

const pageLayouts: { label: string; value: PageLayout }[] = [
  { label: "Default Layout", value: "DEFAULT" },
  { label: "Full Width", value: "FULL_WIDTH" },
  { label: "Landing Page", value: "LANDING" },
  { label: "Legal Document", value: "LEGAL" },
  { label: "Help Center", value: "HELP_CENTER" },
  { label: "Custom Layout", value: "CUSTOM" },
];

const pageStatuses: { label: string; value: PageStatus }[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

function isBlockNoteDocument(value: unknown): value is PartialBlock[] {
  return (
    Array.isArray(value) &&
    value.every(
      (block) =>
        typeof block === "object" &&
        block !== null &&
        "type" in block &&
        typeof block.type === "string",
    )
  );
}

function isLegacyPageDocument(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "type" in value &&
    value.type === "doc"
  );
}

function toLocalDateTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

const getInitialValues = (page?: IPage | null): PageFormValues => ({
  title: page?.title ?? "",
  slug: page?.slug ?? "",
  subtitle: page?.subtitle ?? "",
  excerpt: page?.excerpt ?? "",
  content: page?.content ?? "",
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
});


export default function PageForm({
  page,
  onSaved,
}: {
  page?: IPage;
  onSaved?: () => void;
}) {


  const router = useRouter();
  const queryClient = useQueryClient();

  // initialize contentJson only if stored as BlockNote array
  const [contentJson, setContentJson] = useState<PageContentJson | null>(() => {
    const json = page?.contentJson;
    return Array.isArray(json) && isBlockNoteDocument(json) ? (json as PageContentJson) : null;
  });
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);
  const [isOgModalOpen, setIsOgModalOpen] = useState(false);

  const {
    data: pagesResult,
    isError: parentPagesError,
    error: parentPagesErrorMessage,
  } = useQuery({
    queryKey: ["admin-pages-parent-options"],
    queryFn: () => getPages({ limit: 1000, sortBy: "title", sortOrder: "asc" }),
    staleTime: 60_000,
  });

  const pageMutation = useMutation({
    mutationFn: async (formValues: PageFormValues) => {
      const title = formValues.title.trim();
      const slug = formValues.slug.trim() || undefined;
      const orderIndex = Number(formValues.orderIndex) || 0;
      const parentId =
        formValues.parentId && formValues.parentId !== "none"
          ? formValues.parentId
          : null;

      if (page) {
        const payload: UpdatePagePayload = {
          title,
          slug,
          subtitle: formValues.subtitle.trim() || null,
          excerpt: formValues.excerpt.trim() || null,
          content: formValues.content,
          ...(contentJson ? { contentJson } : {}),
          layout: formValues.layout,
          status: formValues.status,
          parentId,
          orderIndex,
          thumbnailId: formValues.thumbnailId || null,
          ogImageId: formValues.ogImageId || null,
          metaTitle: formValues.metaTitle.trim() || null,
          metaDescription: formValues.metaDescription.trim() || null,
          canonicalUrl: formValues.canonicalUrl.trim() || null,
          scheduledAt:
            formValues.status === "SCHEDULED" && formValues.scheduledAt
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
        ...(contentJson ? { contentJson } : {}),
        layout: formValues.layout,
        status: formValues.status,
        parentId,
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
        scheduledAt:
          formValues.status === "SCHEDULED" && formValues.scheduledAt
            ? new Date(formValues.scheduledAt).toISOString()
            : null,
        noIndex: formValues.noIndex,
      };
      return createPage(payload);
    },
    onSuccess: async () => {
      toast.success(
        page ? "Page updated successfully." : "Page created successfully.",
      );
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

  const form = useForm({
    defaultValues: getInitialValues(page),
    onSubmit: async ({ value }) => {
      if (!value.title.trim()) {
        toast.error("Please enter a page title.");
        return;
      }
      if (!value.content.replace(/<[^>]*>/g, "").trim()) {
        toast.error("Please add page content before saving.");
        return;
      }
      await pageMutation.mutateAsync(value);
    },
  });

  useEffect(() => {
    if (page?.content) {
      form.reset({ ...form.state.values, content: page.content });
    }
  }, [form, page]);

  const parentPages = (pagesResult?.data ?? []).filter(
    (item) => item.id !== page?.id && !item.isDeleted,
  );

  return (
    <div>
      <form
        className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px]"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Title */}
          <form.Field name="title">
            {(field) => (
              <div className="space-y-2 rounded-xl border bg-card p-5 shadow-sm">
                <FieldLabel className="text-base font-semibold">Page Title</FieldLabel>
                <FormInput
                  name={field.name}
                  placeholder="Enter page title..."
                  value={field.state.value}
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              </div>
            )}
          </form.Field>

          {/* Content (RichTextEditor) */}
          
          <form.Field name="content">
            {(field) => (
              <section className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
                <div>
                  <h2 className="text-base font-semibold">Page Content</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Write and format rich media content as it will appear on your published page.
                  </p>
                </div>
                <RichTextEditor
                  content={
                    contentJson ??
                    (isLegacyPageDocument(page?.contentJson)
                      ? page?.contentJson
                      : field.state.value)
                  }
                  onChange={(json, html) => {
                    setContentJson(json);
                    field.handleChange(html);
                  }}
                />
                {field.state.meta.isTouched &&
                  !field.state.value?.replace(/<[^>]*>/g, "").trim() && (
                    <p className="text-sm text-destructive" role="alert">
                      Add page content before saving.
                    </p>
                  )}
              </section>
            )}
          </form.Field>

          {/* Subtitle & Excerpt */}
          <section className="grid gap-4 rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">Summary & Excerpt</h2>
            <form.Field name="subtitle">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Subtitle"
                  placeholder="Brief subtitle or secondary heading..."
                  value={field.state.value}
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>

            <form.Field name="excerpt">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Excerpt"
                  type="textarea"
                  placeholder="Short summary for search results and previews..."
                  value={field.state.value}
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
          </section>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-5">
          {/* Publish Box */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold text-base">Publish</h2>

            <form.Field name="status">
              {(field) => (
                <>
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as PageStatus)
                      }
                      onOpenChange={(open) => {
                        if (!open) field.handleBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          {pageStatuses.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  {field.state.value === "SCHEDULED" && (
                    <form.Field name="scheduledAt">
                      {(scheduledField) => (
                        <FormInput
                          name={scheduledField.name}
                          label="Publish Date & Time"
                          type="datetime-local"
                          value={scheduledField.state.value}
                          onBlur={scheduledField.handleBlur}
                          onChange={scheduledField.handleChange}
                          errors={
                            scheduledField.state.meta.isTouched
                              ? scheduledField.state.meta.errors
                              : []
                          }
                        />
                      )}
                    </form.Field>
                  )}
                </>
              )}
            </form.Field>

            <Button
              type="submit"
              className="w-full"
              disabled={pageMutation.isPending}
            >
              {pageMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  {page ? "Saving changes..." : "Creating page..."}
                </span>
              ) : page ? (
                "Save changes"
              ) : (
                "Create page"
              )}
            </Button>
          </section>

          {/* Featured Media */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              <h2 className="font-semibold text-base">Featured Media</h2>
            </div>

            {/* Thumbnail Assignment */}
            <form.Field name="thumbnailMedia">
              {(field) => {
                const thumbnailMedia = field.state.value;
                return (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-foreground">
                      Page Featured Image
                    </label>
                    {thumbnailMedia ? (
                      <div className="relative group rounded-xl border border-border overflow-hidden bg-muted/40">
                        <div className="relative aspect-video w-full overflow-hidden bg-muted/60">
                          <Image
                            height={167}
                            width={296}
                            src={
                              thumbnailMedia.secureUrl ||
                              thumbnailMedia.url
                            }
                            alt={thumbnailMedia.altText || "Thumbnail"}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="p-2.5 flex items-center justify-between gap-2 text-xs">
                          <span
                            className="truncate font-medium text-foreground max-w-36"
                            title={thumbnailMedia.fileName}
                          >
                            {thumbnailMedia.fileName}
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
                                form.setFieldValue("thumbnailId", null);
                                field.handleChange(null);
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
                          Choose or upload from media library
                        </span>
                      </div>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Social OG Image Assignment */}
            <form.Field name="ogImageMedia">
              {(field) => {
                const ogImageMedia = field.state.value;
                return (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <label className="block text-xs font-semibold text-foreground">
                      Social Share (OG) Image
                    </label>
                    {ogImageMedia ? (
                      <div className="relative group rounded-xl border border-border overflow-hidden bg-muted/40">
                        <div className="relative aspect-video w-full overflow-hidden bg-muted/60">
                          <Image
                            height={167}
                            width={296}
                            src={
                              ogImageMedia.secureUrl ||
                              ogImageMedia.url
                            }
                            alt={ogImageMedia.altText || "Social Image"}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="p-2.5 flex items-center justify-between gap-2 text-xs">
                          <span
                            className="truncate font-medium text-foreground max-w-36"
                            title={ogImageMedia.fileName}
                          >
                            {ogImageMedia.fileName}
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
                                form.setFieldValue("ogImageId", null);
                                field.handleChange(null);
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
                );
              }}
            </form.Field>
          </section>

          {/* Page Settings */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold text-base">Page Settings</h2>

            <form.Field name="slug">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="URL Slug"
                  placeholder="e.g. about-us"
                  value={field.state.value}
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>

            <form.Field name="parentId">
              {(field) => (
                <Field>
                  <FieldLabel>Parent Page</FieldLabel>
                  <Select
                    value={field.state.value || "none"}
                    onValueChange={(val) =>
                      field.handleChange(!val || val === "none" ? "" : val)
                    }
                    onOpenChange={(open) => {
                      if (!open) field.handleBlur();
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{(val) => {
                const item = parentPages.find(p => p.id === val);
                return item ? item.title : "No Parent Page (Root)";
              }}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Parent Page</SelectLabel>
                        <SelectItem value="none">
                          No Parent Page (Root)
                        </SelectItem>
                        {parentPages.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {parentPagesError && (
                    <p className="text-xs text-destructive">
                      {parentPagesErrorMessage.message}
                    </p>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="layout">
              {(field) => (
                <Field>
                  <FieldLabel>Layout Template</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) =>
                      field.handleChange(val as PageLayout)
                    }
                    onOpenChange={(open) => {
                      if (!open) field.handleBlur();
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Layout Template</SelectLabel>
                        {pageLayouts.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>

            <form.Field name="orderIndex">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Navigation Order"
                  type="number"
                  placeholder="0"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
          </section>

          {/* Search Appearance & SEO */}
          <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold text-base">Search Appearance & SEO</h2>

            <form.Field name="metaTitle">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Meta Title"
                  placeholder="Page title for search results..."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>

            <form.Field name="metaDescription">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Meta Description"
                  type="textarea"
                  placeholder="Description snippet for search engines..."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>

            <form.Field name="canonicalUrl">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Canonical URL"
                  type="url"
                  placeholder="https://yourdomain.com/canonical-url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>

            <form.Field name="noIndex">
              {(field) => (
                <label className="flex items-start gap-2.5 text-xs font-medium cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  <span>Hide this page from search engine index (noindex)</span>
                </label>
              )}
            </form.Field>
          </section>
        </aside>
      </form>

      {/* Featured Thumbnail Selector Modal */}
      <MediaSelectModal
        open={isThumbnailModalOpen}
        onOpenChange={setIsThumbnailModalOpen}
        selectedId={form.getFieldValue("thumbnailId")}
        title="Assign Page Featured Image"
        description="Select an image from library or upload to display as featured banner for this page."
        onSelect={(asset) => {
          form.setFieldValue("thumbnailId", asset.id);
          form.setFieldValue("thumbnailMedia", asset);
        }}
      />

      {/* Social OG Image Selector Modal */}
      <MediaSelectModal
        open={isOgModalOpen}
        onOpenChange={setIsOgModalOpen}
        selectedId={form.getFieldValue("ogImageId")}
        title="Assign Social Share (OG) Image"
        description="Select the preview card image when this page is shared on social media."
        onSelect={(asset) => {
          form.setFieldValue("ogImageId", asset.id);
          form.setFieldValue("ogImageMedia", asset);
        }}
      />
    </div>
  );
}
