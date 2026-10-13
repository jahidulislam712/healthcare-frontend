"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  onBlue: () => void;
  onChange: (value: string) => void;
  errors: Array<string | { message?: string } | undefined>;
  rightElement?: React.ReactNode;
};
function FormInput({
  label,
  name,
  value,
  placeholder,
  type = "text",
  autoComplete,
  onBlue,
  onChange,
  errors,
  rightElement,
}: FormInputProps) {
  const errorId = `${name}-error`;
  const hasErrors = errors.length > 0;

  errors = [
    ...new Set(
      errors.map((error) =>
        typeof error === "string" ? error : (error?.message ?? "Invalid value"),
      ),
    ),
  ];

  return (
    <Field>
      <div className="flex items-center">
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        {rightElement}
      </div>
      <Input
        type={type}
        id={name}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onBlur={onBlue}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={hasErrors}
        aria-describedby={hasErrors ? errorId : undefined}
      />

      {hasErrors && (
        <div id={errorId} className="text-red-600 text-sm">
          {errors.map((error, index) => {
            const message =
              typeof error === "string"
                ? error
                : (error?.message ?? "Invalid value");

            return <p key={index}>{message}</p>;
          })}
        </div>
      )}
    </Field>
  );
}

export default FormInput;
