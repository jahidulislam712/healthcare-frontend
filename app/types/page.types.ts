import { PaginationMeta } from "./api.types";
import { IMediaAsset } from "./media.types";
import type { PartialBlock } from "@blocknote/core";

export type PageContentJson = PartialBlock[];

export type PageStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";

export type PageLayout =
  | "DEFAULT"
  | "FULL_WIDTH"
  | "LANDING"
  | "LEGAL"
  | "HELP_CENTER"
  | "CUSTOM";

export interface PageFormValues {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: string;
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

export interface IPage {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string;
  contentJson: unknown;
  layout: PageLayout;
  status: PageStatus;
  parentId: string | null;
  orderIndex: number;
  thumbnailId: string | null;
  ogImageId: string | null;
  thumbnailMedia?: IMediaAsset | null;
  ogImageMedia?: IMediaAsset | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: Pick<IPage, "id" | "title" | "slug"> | null;
  children?: Pick<IPage, "id" | "title" | "slug" | "orderIndex">[];
}

export interface PageQueryParams extends Record<string, unknown> {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PageListResult {
  data: IPage[];
  meta: PaginationMeta;
}

export interface CreatePagePayload {
  title: string;
  slug?: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  contentJson?: PageContentJson | null;
  layout?: PageLayout;
  status?: PageStatus;
  parentId?: string | null;
  orderIndex?: number;
  thumbnailId?: string | null;
  ogImageId?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string | null;
  scheduledAt?: string | null;
  noIndex?: boolean;
}

export interface UpdatePagePayload {
  title?: string;
  slug?: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content?: string;
  contentJson?: PageContentJson | null;
  layout?: PageLayout;
  status?: PageStatus;
  parentId?: string | null;
  orderIndex?: number;
  thumbnailId?: string | null;
  ogImageId?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  scheduledAt?: string | null;
  noIndex?: boolean;
}
