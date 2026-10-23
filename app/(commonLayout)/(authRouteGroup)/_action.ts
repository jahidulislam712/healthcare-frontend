"use server";

import { ApiResponse } from "@/app/types/api.types";
import { ILoginResponse } from "@/app/types/auth.types";
import {
  IForgetPasswordPayload,
  ILoginPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  loginZodSchema,
} from "@/app/zod/auth.validation";
import { ApiClientError, httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAMES = new Set([
  "accessToken",
  "refreshToken",
  "better-auth.session_token",
]);

async function copyAuthCookies(setCookieHeaders: string[]) {
  if (setCookieHeaders.length === 0) {
    throw new Error("Login response did not include authentication cookies.");
  }

  const receivedNames = new Set<string>();
  const cookieStore = await cookies();

  for (const header of setCookieHeaders) {
    const cookiePair = header.split(";", 1)[0];
    const separator = cookiePair.indexOf("=");

    if (separator < 1) continue;

    const name = cookiePair.slice(0, separator);
    const value = cookiePair.slice(separator + 1);

    if (!AUTH_COOKIE_NAMES.has(name) || !value) continue;

    const maxAgeMatch = header.match(/;\s*max-age=(\d+)/i);
    const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : undefined;

    cookieStore.set(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(maxAge !== undefined ? { maxAge } : {}),
    });

    receivedNames.add(name);
  }

  for (const name of AUTH_COOKIE_NAMES) {
    if (!receivedNames.has(name)) {
      throw new Error(`Login response did not include the ${name} cookie.`);
    }
  }
}

export const loginAction = async (
  payload: ILoginPayload,
): Promise<ApiResponse<ILoginResponse>> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    // const response = await fetch(new URL("auth/login", formattedBaseUrl), {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(parsedPayload.data),
    //   cache: "no-store",
    // });

    const response = await httpClient.postWithHeaders(
      "/auth/login",
      parsedPayload.data,
    );

    // console.log(response, "proxy res");
    // const result = (await response.json()) as ApiResponse<ILoginResponse>;

    if (!response.data.success || !response.data.data) {
      return {
        success: false,
        message: response.data.message ?? "Unable to login. Please try again.",
      };
    }

    const setCookieHeaders = response.headers["set-cookie"];

    if (!Array.isArray(setCookieHeaders)) {
      throw new Error("Login response did not include authentication cookies.");
    }

    await copyAuthCookies(setCookieHeaders);
    redirect("/dashboard");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    if (error instanceof ApiClientError) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        return {
          success: false,
          message:
            "Your email is not verified. We sent a verification code to your email address.",
        };
      }

      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Unable to login. Please try again.",
    };
  }
};

/**
 * Register / SignUp action
 */
export const registerAction = async (
  payload: IRegisterPayload,
): Promise<ApiResponse<unknown>> => {
  try {
    const result = await httpClient.post("/auth/register", payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Registration failed",
      };
    }

    return {
      success: true,
      message: result.message || "Registration successful",
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Unable to register. Please try again.",
    };
  }
};

/**
 * Forget Password action
 */
export const forgetPasswordAction = async (
  payload: IForgetPasswordPayload,
): Promise<ApiResponse<unknown>> => {
  try {
    const result = await httpClient.post("/auth/forget-password", payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to process forget password",
      };
    }

    return {
      success: true,
      message: result.message || "Failed to process forget password",
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Unable to process Forget Password. Please try again.",
    };
  }
};

/**
 * Reset Password Action
 */
export const resetPasswordAction = async (
  payload: IResetPasswordPayload,
): Promise<ApiResponse<undefined>> => {
  try {
    return await httpClient.post("/auth/reset-password", payload);
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Unable to reset your password. Please try again.",
    };
  }
};

/**
 * Reset Password Action
 */
export const logoutAction = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join(";");

  try {
    await httpClient.post("/auth/logout", undefined, {
      headers: { Cookie: cookieHeader },
    });
  } finally {
    for (const name of [
      "accessToken",
      "refreshToken",
      "better-auth.session_token",
    ]) {
      cookieStore.set(name, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }

    redirect("/login");
  }

  return {
    success: true,
    message: "Logged out successfully",
  };
};
