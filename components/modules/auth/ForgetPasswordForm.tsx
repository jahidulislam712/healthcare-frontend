"use client";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import FormInput from "@/components/shared/form/FormInput";
import { useForm } from "@tanstack/react-form";
import { Spinner } from "@/components/ui/spinner";
import { forgetPasswordZodSchema } from "@/app/zod/auth.validation";
import { forgetPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/_action";
import { useState } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [emailForReset, setEmailForReset] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onBlur: forgetPasswordZodSchema,
      onSubmit: forgetPasswordZodSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null);
      const result = await forgetPasswordAction(value);

      if (result.success) {
        setSubmitResult(null);
        setEmailForReset(value.email.trim().toLowerCase());
      } else {
        setSubmitResult(result);
      }
    },
  });

  if (emailForReset) {
    return (
      <ResetPasswordForm
        email={emailForReset}
        className={className}
        onChangeEmail={() => {
          setSubmitResult(null);
          setEmailForReset(null);
        }}
        onReturnToLogin={() => {
          setSubmitResult(null);
          setEmailForReset(null);
        }}
      />
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
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
          <h1 className="text-2xl font-bold">Forget Password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to reset your password
          </p>
        </div>

        <form.Field name="email">
          {(field) => (
            <FormInput
              label="Email"
              name={field.name}
              value={field.state.value}
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              onBlue={field.handleBlur}
              onChange={field.handleChange}
              errors={field.state.meta.isTouched ? field.state.meta.errors : []}
            />
          )}
        </form.Field>

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

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex gap-2 items-center">
                    <Spinner data-icon="inline-start" />
                    Get Code
                  </span>
                ) : (
                  "Get Code"
                )}
              </Button>
            </Field>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
