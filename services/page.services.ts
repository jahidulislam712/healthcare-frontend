"use server";

import {
  CreatePagePayload,
  IPage,
  PageListResult,
  PageQueryParams,
  UpdatePagePayload,
} from "@/app/types/page.types";
import { serverApiClient } from "@/lib/axios/serverApiClient";

export const getPages = async (
  params: PageQueryParams = {},
): Promise<PageListResult> => {
  const response = await serverApiClient.get<IPage[]>("/pages", { params });

  if (!response.success || response.data === undefined || !response.meta) {
    throw new Error(response.message || "Unable to fetch pages.");
  }

  return { data: response.data, meta: response.meta };
};

export const getPageBySlug = async (slug: string): Promise<IPage> => {
  const response = await serverApiClient.get<IPage>(
    `/pages/${encodeURIComponent(slug)}`,
  );

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to fetch page.");
  }

  return response.data;
};

export const createPage = async (
  payload: CreatePagePayload,
): Promise<IPage> => {
  const response = await serverApiClient.post<IPage>("/pages", payload);

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to create page.");
  }

  return response.data;
};

export const updatePage = async (
  id: string,
  payload: UpdatePagePayload,
): Promise<IPage> => {
  const response = await serverApiClient.patch<IPage>(`/pages/${id}`, payload);

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to update page.");
  }

  return response.data;
};

export const deletePage = async (id: string): Promise<IPage> => {
  const response = await serverApiClient.delete<IPage>(`/pages/${id}`);

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to delete page.");
  }

  return response.data;
};
