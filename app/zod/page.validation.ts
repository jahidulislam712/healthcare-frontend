import z from "zod";

export const pageFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Page title is required")
    .max(255, "Title cannot exceed 255 characters"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .or(z.literal(""))
    .optional(),
  subtitle: z.string().trim().max(255).optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().min(1, "Page content is required"),
  layout: z
    .enum(["DEFAULT", "FULL_WIDTH", "LANDING", "LEGAL", "HELP_CENTER", "CUSTOM"])
    .default("DEFAULT"),
  status: z
    .enum(["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"])
    .default("DRAFT"),
  parentId: z.string().optional().nullable(),
  orderIndex: z.string().optional().default("0"),
  thumbnailId: z.string().optional().nullable(),
  ogImageId: z.string().optional().nullable(),
  metaTitle: z.string().trim().max(255).optional(),
  metaDescription: z.string().trim().optional(),
  canonicalUrl: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\/.+/.test(val), {
      message: "Canonical URL must start with http:// or https://",
    }),
  scheduledAt: z.string().optional(),
  noIndex: z.boolean().default(false),
});

export type IPageFormSchema = z.infer<typeof pageFormSchema>;
