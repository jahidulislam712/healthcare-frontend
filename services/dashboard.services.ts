"use server";

import { serverApiClient } from "@/lib/axios/serverApiClient";

export const getDashboardData = async () => {
  try {
    return await serverApiClient.get("/stats");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message ||
        "An unexpected error occured while fetching dashboard data.",
      data: null,
      meta: null,
    };
  }
};
