"use client";
import { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import {
  FieldDescription,
  FieldGroup,
  Field,
  FieldSeparator,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { GalleryVerticalEnd } from "lucide-react";
import { IRegisterPayload, registerZodSchema } from "@/app/zod/auth.validation";
import Link from "next/link";
import FormInput from "@/components/shared/form/FormInput";
import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/_action";
import { Spinner } from "@/components/ui/spinner";

function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } satisfies IRegisterPayload,
    validators: {
      onBlur: registerZodSchema,
      onSubmit: registerZodSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null);
      const result = await registerAction(value);

      setSubmitResult(result);
    },
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
            <FieldDescription>
              Already have an account? <Link href="/login">Sign in</Link>
            </FieldDescription>
          </div>

          <form.Field name="name">
            {(field) => {
              return (
                <FormInput
                  label="Full Name"
                  name={field.name}
                  placeholder="Enter full name"
                  value={field.state.value}
                  autoComplete="name"
                  onBlue={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              );
            }}
          </form.Field>
          <form.Field name="email">
            {(field) => {
              return (
                <FormInput
                  label="Email Address"
                  name={field.name}
                  placeholder="Enter email address"
                  value={field.state.value}
                  type="email"
                  autoComplete="email"
                  onBlue={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              );
            }}
          </form.Field>
          <form.Field name="password">
            {(field) => {
              return (
                <FormInput
                  label="Password"
                  name={field.name}
                  placeholder="Enter password"
                  value={field.state.value}
                  type="password"
                  onBlue={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              );
            }}
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
                      <Spinner data-icon="inline-start" /> Creating Account
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>
            )}
          </form.Subscribe>

          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button">
              <FaApple />
              Continue with Apple
            </Button>
            <Button variant="outline" type="button">
              <FaGoogle />
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

export default RegisterForm;
