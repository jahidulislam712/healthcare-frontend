"use server";

import { ISpecialty, SpecialtyListResult, SpecialtyQueryParams } from "@/app/types/specialty.types";
import { ICreateSpecialtyPayload } from "@/app/zod/specialty.validation";
import { serverApiClient } from "@/lib/axios/serverApiClient";

export const getSpecialties = async (params: SpecialtyQueryParams): Promise<SpecialtyListResult> => {
  const response = await serverApiClient.get<ISpecialty[]>("/specialties", {
    params
  });

  if (!response.success || response.data === undefined || !response.meta) {
    throw new Error(response.message || "Unable to fetch specialites");
  }

  return {data: response.data, meta: response.meta}

};

export const createSpecialty = async (payload: ICreateSpecialtyPayload) => {
  const response = await serverApiClient.post("/specialties", payload);

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to create specialty");
  }

  return response.data;
};

export const editSpecialty = async (
  id: string,
  payload: ICreateSpecialtyPayload,
) => {
  const response = await serverApiClient.patch(`/specialties/${id}`, payload);

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to create specialty");
  }

  return response.data;
};

export const deleteSpecialty = async (id: string) => {
  const response = await serverApiClient.delete(`/specialties/${id}`);

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to delete specialty");
  }

  return response.data;
};
