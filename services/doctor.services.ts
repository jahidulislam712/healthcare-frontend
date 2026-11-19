"use server";

import { IDoctor } from "@/app/types/doctor.types";
import {
  ICreateDoctorPayload,
  IEditDoctorPayload,
} from "@/app/zod/doctor.validation";
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

export const updateDoctor = async (id: string, payload: IEditDoctorPayload): Promise<IEditDoctorPayload> => {
  const response = await serverApiClient.patch<IEditDoctorPayload>(
    `/doctors/${id}`,
    payload,
  );

  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Unable to update doctor");
  }

  return response.data;
};
