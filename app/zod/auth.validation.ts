import { z } from "zod";

/**
 * Login Zod Schema
 */
export const loginZodSchema = z.object({
  email: z.string().min(1, "Email is required").pipe(z.email()),
  password: z.string().min(8, {
    error: (issue) =>
      issue.input === ""
        ? "Password cannot be empty"
        : "Password must be at least 8 characters long",
  }),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

/**
 * Register Zod Schema
 */
export const registerZodSchema = z.object({
  name: z
    .string()
    .min(3, {
      error: (issue) =>
        issue.input === ""
          ? "Name is required"
          : "Name must be at least 2 characters long",
    })
    .max(100, "Name cannot be more than 100 characters"),
  email: z.string().min(1, "Email is required").pipe(z.email()),
  password: z.string().min(8, {
    error: (issue) =>
      issue.input === ""
        ? "Password cannot be empty"
        : "Password must be at least 8 characters long",
  }),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(
  //   /[@$!%*?&]/,
  //   "Password must contain at least one special character (@, $, !, %, *, ?, &)",
  // ),
});
export type IRegisterPayload = z.infer<typeof registerZodSchema>;

/**
 * Forgot Password Zod Schema
 */
export const forgetPasswordZodSchema = z.object({
  email: z.string().min(1, "Email is required").pipe(z.email()),
});
export type IForgetPasswordPayload = z.infer<typeof forgetPasswordZodSchema>;

/**
 * Reset Password Zod Schema
 */
export const resetPasswordFormSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot be more than 128 characters"),
});

export const resetPasswordZodSchema = z.object({
  email: z.email().transform((email) => email.trim().toLowerCase()),
  ...resetPasswordFormSchema.shape,
});
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
