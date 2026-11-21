import { PaginationMeta } from "./api.types";

export interface IMediaAsset {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  fileName: string;
  originalName: string | null;
  mimeType: string;
  size: number;
  height: number | null;
  width: number | null;
  format: string | null;
  altText: string | null;
  caption: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  _count?: {
    pageThumbnails?: number;
    pageOgImages?: number;
    blogFeaturedImages?: number;
    blogOgImages?: number;
  };
}

export interface MediaListResult {
  data: IMediaAsset[];
  meta: PaginationMeta;
}

export interface MediaQueryParams extends Record<string, unknown> {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateMediaAssetPayload {
  altText?: string | null;
  caption?: string | null;
}
