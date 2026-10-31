"use client";

import { Gender } from "@/app/types/doctor.types";
import { ISpecialty } from "@/app/types/specialty.types";
import {
  createDoctorFormSchema,
  createDoctorSubmissionSchema,
  ICreateDoctorFormValues,
  ICreateDoctorPayload,
} from "@/app/zod/doctor.validation";
import FormInput from "@/components/shared/form/FormInput";
import ProfilePhotoUpload from "@/components/shared/form/ProfilePhotoUpload";
import { SpecialtiesMultiSelect } from "@/components/shared/form/SpecialtiesMultiSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { createDoctor } from "@/services/doctor.services";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function CreateDoctorFormModal({
  specialties,
}: {
  specialties: ISpecialty[];
}) {
  const [open, setOpen] = useState(false);
  const [submitMsg, setsubmitMsg] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const createDoctorMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: async () => {
      // close modal
      setOpen(false);
      // reset form
      form.reset();

      // display a toast
      toast.success("Doctor created successfully.");

      // refetch doctor data
      await queryClient.invalidateQueries({
        queryKey: ["admin-doctors-data"],
      });
    },
    onError: (error) => {
      setsubmitMsg(
        error.message || "Unable to create doctor. Please try again.",
      );
      toast.error(
        error.message || "Unable to create doctor. Please try again.",
      );
    },
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean, eventDetails: { reason: string }) => {
      if (!nextOpen && eventDetails.reason === "outside-press") {
        return;
      }

      setOpen(nextOpen);
    },
    [],
  );

  const defaultValues: ICreateDoctorFormValues = {
    name: "",
    password: "",
    email: "",
    contactNumber: "",
    address: "",
    registrationNumber: "",
    experience: "",
    gender: Gender.MALE,
    appointmentFee: "",
    qualification: "",
    currentWorkingPlace: "",
    designation: "",
    specialties: [],
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createDoctorFormSchema,
    },
    onSubmitInvalid: ({ value, formApi }) => {
      console.log("Validation values:", value);

      console.log(
        "Validation errors:",
        JSON.stringify(formApi.state.errors, null, 2),
      );

      console.log("Field errors:", formApi.state.fieldMeta);
    },
    onSubmit: async ({ value }) => {
      const formData = createDoctorSubmissionSchema.safeParse(value);

      if (!formData.success) {
        console.error(formData.error.issues);
        return;
      }

      const payload: ICreateDoctorPayload = formData.data;
      await createDoctorMutation.mutateAsync(payload);
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="default">
            <Plus className="size-4" />
            Create Doctor
          </Button>
        }
      />
      <DialogContent className="sm:w-[calc(100%-32px)] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Doctor</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4 md:gap-y-5">
            <form.Field name="name">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Full Name"
                  value={field.state.value}
                  placeholder="Dr. Jhon"
                  type="text"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="email">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Email"
                  value={field.state.value}
                  placeholder="dr.jhon@gmail.com"
                  type="email"
                  autoComplete="email"
                  onBlur={field.handleBlur}
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
                  name={field.name}
                  label="Password"
                  value={field.state.value}
                  placeholder="********"
                  type="password"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="registrationNumber">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Registration Number"
                  value={field.state.value}
                  placeholder="REG329654"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="designation">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Designation"
                  value={field.state.value}
                  placeholder="Cardiology in Dhaka"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="qualification">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Qualification"
                  value={field.state.value}
                  placeholder="MBBS, FCPS, FRCP (London), FACC, FESC."
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="experience">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Experience (years)"
                  value={Number(field.state.value)}
                  placeholder="e.g: 5"
                  type="number"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="specialties">
              {(field) => (
                <div className="space-y-3">
                  <label className="text-sm font-medium block">
                    Specialties
                  </label>

                  <SpecialtiesMultiSelect
                    options={specialties}
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder="Select doctor's specialties"
                  />

                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <div className="text-sm text-red-600">
                        {field.state.meta.errors.map((error, index) => (
                          <p key={index}>
                            {typeof error === "string" && error !== undefined
                              ? error
                              : error?.message || "Invalid value"}
                          </p>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </form.Field>
            <form.Field name="appointmentFee">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Fees (BDT)"
                  value={Number(field.state.value)}
                  placeholder="800"
                  type="number"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="gender">
              {(field) => (
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Select
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as Gender)
                    }
                    onOpenChange={(open) => {
                      if (!open) field.handleBlur();
                    }}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Gender</SelectLabel>

                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        <SelectItem value={Gender.OTHER}>Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {/* <label htmlFor={field.name}>Gender</label>
                  <select
                    name={field.name}
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => e.target.value as Gender}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                  </select> */}
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <div className="text-sm text-destructive">
                        {field.state.meta.errors.map((error, index) => (
                          <p key={index}>
                            {typeof error === "string" ? error : error?.message}
                          </p>
                        ))}
                      </div>
                    )}
                </Field>
              )}
            </form.Field>
            <form.Field name="address">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Address"
                  value={field.state.value ?? ""}
                  placeholder="House 12, Road 5, Dhanmondi"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="contactNumber">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Contact"
                  value={field.state.value ?? ""}
                  placeholder="+880 12345 67890"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="currentWorkingPlace">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Current Working Place"
                  value={field.state.value ?? ""}
                  placeholder="Dhaka, Bangladesh"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            {/* <form.Field name="profilePhoto">
              {(field) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Photo</label>

                  <ProfilePhotoUpload
                    value={field.state.value ?? ""}
                    onChange={field.handleChange}
                  />

                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <div className="text-sm text-red-600">
                        {field.state.meta.errors.map((error, index) => (
                          <p key={index}>
                            {typeof error === "string" ? error : error.message}
                          </p>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </form.Field> */}
          </FieldGroup>

          {submitMsg && (
            <div
              className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              {submitMsg}
            </div>
          )}
          <DialogFooter className="mt-5">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex gap-2 items-center">
                      <Spinner data-icon="inline-start" />
                      Creating Doctor...
                    </span>
                  ) : (
                    "Create Doctor"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
