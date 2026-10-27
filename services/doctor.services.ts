"use server";

import { ApiResponse } from "@/app/types/api.types";
import { IDoctor } from "@/app/types/doctor.types";
import { serverApiClient } from "@/lib/axios/serverApiClient";

export const getDoctors = async (): Promise<ApiResponse<IDoctor[]>> => {
  try {
    return await serverApiClient.get<IDoctor[]>("/doctors");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unable of fetch doctor data",
    };
  }
};
