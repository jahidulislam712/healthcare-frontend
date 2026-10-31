"use server";

import { IDoctor } from "@/app/types/doctor.types";
import { ICreateDoctorPayload } from "@/app/zod/doctor.validation";
import { serverApiClient } from "@/lib/axios/serverApiClient";

export const getDoctors = async () => {
  const response = await serverApiClient.get<IDoctor[]>("/doctors");

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to fetch doctors.");
  }

  return { data: response.data, meta: response.meta };
};

export const createDoctor = async (
  payload: ICreateDoctorPayload,
): Promise<ICreateDoctorPayload> => {
  const response = await serverApiClient.post<ICreateDoctorPayload>(
    "/users/create-doctor",
    payload,
  );

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to create doctor");
  }

  return response.data;
};
