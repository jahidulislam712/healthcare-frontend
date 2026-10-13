"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
import { cn } from "cn";
import {
  forgetPasswordAction,
  resetPasswordAction,
} from "@/app/(commonLayout)/(authRouteGroup)/_action";
import {
  resetPasswordFormSchema,
  type IResetPasswordPayload,
} from "@/app/zod/auth.validation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import FormInput from "@/components/shared/form/FormInput";
import { Spinner } from "@/components/ui/spinner";

type ResetPasswordFormProps = {
  email: string;
  className?: string;
  onChangeEmail: () => void;
  onReturnToLogin: () => void;
};

export default function ResetPasswordForm({
  email,
  className,
  onChangeEmail,
  onReturnToLogin,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm({
    defaultValues: {
      otp: "",
      password: "",
    },
    validators: {
      onBlur: resetPasswordFormSchema,
      onSubmit: resetPasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null);
      const payload: IResetPasswordPayload = { ...value, email };
      const result = await resetPasswordAction(payload);
      setSubmitResult(result);

      if (result.success) {
        setIsResetComplete(true);
      }
    },
  });

  const resendCode = async () => {
    setIsResending(true);
    setSubmitResult(null);

    try {
      const result = await forgetPasswordAction({ email });
      setSubmitResult({
        success: result.success,
        message: result.success
          ? "If an account exists for that email, a new reset code will be sent."
          : result.message,
      });
    } catch {
      setSubmitResult({
        success: false,
        message: "Unable to request another code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">Acme Inc.</span>
          </Link>
          <h1 className="text-2xl font-bold">
            {isResetComplete ? "Password updated" : "Reset your password"}
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            {isResetComplete
              ? "Your password has been changed. You can now sign in."
              : `If an account exists for ${email}, a reset code will be sent. Enter the code and choose a new password.`}
          </p>
        </div>

        {!isResetComplete && (
          <>
            <form.Field name="otp">
              {(field) => (
                <FormInput
                  label="Reset code"
                  name={field.name}
                  value={field.state.value}
                  placeholder="Enter the 6-digit code"
                  type="text"
                  autoComplete="one-time-code"
                  onBlue={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <FormInput
                  label="New password"
                  name={field.name}
                  value={field.state.value}
                  placeholder="Enter a new password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  onBlue={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                  rightElement={
                    <Button
                      variant="link"
                      className="ml-auto"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  }
                />
              )}
            </form.Field>
          </>
        )}

        {submitResult && (
          <p
            role={submitResult.success ? "status" : "alert"}
            aria-live="polite"
            className={
              submitResult.success
                ? "text-sm text-green-600"
                : "text-sm text-destructive"
            }
          >
            {submitResult.message}
          </p>
        )}

        {isResetComplete ? (
          <Field>
            <Link
              href="/login"
              className={cn(buttonVariants())}
              onClick={onReturnToLogin}
            >
              Return to login
            </Link>
          </Field>
        ) : (
          <>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Spinner data-icon="inline-start" />
                        Reset Password
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </Field>
              )}
            </form.Subscribe>

            <div className="flex flex-col items-center gap-2 text-sm">
              <button
                type="button"
                className="underline underline-offset-4 disabled:opacity-50"
                disabled={isResending}
                onClick={resendCode}
              >
                {isResending ? "Requesting another code..." : "Resend code"}
              </button>
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={onChangeEmail}
              >
                Use a different email
              </button>
            </div>
          </>
        )}
      </FieldGroup>
    </form>
  );
}
