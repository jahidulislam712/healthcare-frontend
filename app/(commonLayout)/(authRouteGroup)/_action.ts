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
import { setTokenInCookies } from "@/lib/tokenUtils";
import { redirect } from "next/navigation";

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
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    if (response.success && response.data) {
      const { accessToken, refreshToken, token } = response.data;

      await setTokenInCookies("accessToken", accessToken);
      await setTokenInCookies("refreshToken", refreshToken);
      await setTokenInCookies("better-auth.session_token", token);

      redirect("/dashboard");
    }

    return {
      success: false,
      message: "Login failed: No response data received.",
    };
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
