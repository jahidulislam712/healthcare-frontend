"use client";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import FormInput from "@/components/shared/form/FormInput";
import { useForm } from "@tanstack/react-form";
import { Spinner } from "@/components/ui/spinner";
import { loginZodSchema } from "@/app/zod/auth.validation";
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/_action";
import { useState } from "react";
import { redirect } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: loginZodSchema,
      onSubmit: loginZodSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null);
      const result = await loginAction(value);
      setSubmitResult(result);
    },
  });
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
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
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
        <form.Field name="password">
          {(field) => (
            <FormInput
              label="Password"
              name={field.name}
              value={field.state.value}
              placeholder="Enter your password"
              type="password"
              onBlue={field.handleBlur}
              onChange={field.handleChange}
              errors={field.state.meta.isTouched ? field.state.meta.errors : []}
              rightElement={
                <Link
                  href="/forget-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                  onClick={() => setSubmitResult(null)}
                >
                  Forgot your password?
                </Link>
              }
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
                    Logging...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </Field>
          )}
        </form.Subscribe>

        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
              redirect(`${baseUrl}/auth/login/google`)
            }}
          >
            <FaGoogle />
            Login with Google
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
