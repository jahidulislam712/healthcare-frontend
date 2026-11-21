
import type { UserInfo } from "@/app/types/auth.types";
import { cookies } from "next/headers";
import { ApiClientError, httpClient } from "./axios/httpClient";
import "server-only";

export const getCurrentUser = async (): Promise<UserInfo | null> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await httpClient.get<UserInfo>("/auth/me", {
      headers: { Cookie: cookieHeader },
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || "Cannot load your profile.");
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) {
      return null;
    }

    console.error("Cannot load your profile info: ", error);
    return null;
  }
};
