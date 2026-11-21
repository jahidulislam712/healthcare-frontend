"use server";

import {
  IMediaAsset,
  MediaListResult,
  MediaQueryParams,
  UpdateMediaAssetPayload,
} from "@/app/types/media.types";
import { serverApiClient } from "@/lib/axios/serverApiClient";

export const getMedia = async (
  params: MediaQueryParams = {},
): Promise<MediaListResult> => {
  const response = await serverApiClient.get<IMediaAsset[]>("/media", {
    params,
  });

  if (!response.success || response.data === undefined || !response.meta) {
    throw new Error(response.message || "Unable to fetch media assets.");
  }

  return { data: response.data, meta: response.meta };
};

export const getMediaById = async (id: string): Promise<IMediaAsset> => {
  const response = await serverApiClient.get<IMediaAsset>(`/media/${id}`);

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to fetch media asset.");
  }

  return response.data;
};

export const uploadMediaFiles = async (
  formData: FormData,
): Promise<IMediaAsset[]> => {
  const response = await serverApiClient.post<IMediaAsset[]>(
    "/media/upload",
    formData,
  );

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to upload media files.");
  }

  return response.data;
};

export const updateMediaAsset = async (
  id: string,
  payload: UpdateMediaAssetPayload,
): Promise<IMediaAsset> => {
  const response = await serverApiClient.patch<IMediaAsset>(
    `/media/${id}`,
    payload,
  );

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to update media asset.");
  }

  return response.data;
};

export const deleteMediaAsset = async (id: string): Promise<IMediaAsset> => {
  const response = await serverApiClient.delete<IMediaAsset>(`/media/${id}`);

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to delete media asset.");
  }

  return response.data;
};
