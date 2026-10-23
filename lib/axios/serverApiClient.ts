import { ApiRequestOptions } from "@/app/types/api.types";
import { cookies } from "next/headers";
import "server-only";
import { httpClient } from "./httpClient";

const AUTH_COOKIE_NAMES = [
  "accessToken",
  "refreshToken",
  "better-auth.session_token",
];

export const getAuthOptions = async (
  options: ApiRequestOptions = {},
): Promise<ApiRequestOptions> => {
  const cookieStore = await cookies();

  const cookieHeader = AUTH_COOKIE_NAMES.map(
    (name) => `${name}=${cookieStore.get(name)?.value}`,
  )
    .filter((name) => name !== null)
    .join("; ");

  return {
    ...options,
    headers: {
      ...options.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  };
};

export const serverApiClient = {
  async get<T>(endpoint: string, options?: ApiRequestOptions) {
    return httpClient.get<T>(endpoint, await getAuthOptions(options));
  },

  async post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
    return httpClient.post<T>(endpoint, data, await getAuthOptions(options));
  },

  async put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
    return httpClient.put<T>(endpoint, data, await getAuthOptions(options));
  },

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions,
  ) {
    return httpClient.patch<T>(endpoint, data, await getAuthOptions(options));
  },

  async delete<T>(endpoint: string, options?: ApiRequestOptions) {
    return httpClient.delete<T>(endpoint, await getAuthOptions(options));
  },
} as const;
