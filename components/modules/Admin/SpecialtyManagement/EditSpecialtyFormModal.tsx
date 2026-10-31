import {
  createSpecialtyZodSchema,
  ICreateSpecialtyFormValues,
  ICreateSpecialtyPayload,
} from "@/app/zod/specialty.validation";
import FormInput from "@/components/shared/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { PenLine } from "lucide-react";
import { SpecialtyIconPicker } from "./SpecialtyIconPicker";
import { editSpecialty } from "@/services/specialty.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ISpecialty } from "@/app/types/specialty.types";

type EditSpecialtyProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  specialty: ISpecialty | null;
};

export function EditSpecialtyFormModal({
  open,
  setOpen,
  specialty,
}: EditSpecialtyProps) {
  const queryClient = useQueryClient();
  const editSpecialtyMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ICreateSpecialtyPayload;
    }) => editSpecialty(id, payload),
    onSuccess: () => {
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["admin-specialties"] });
      toast.success("Speacialty added successfully.");
    },
    onError: (error) => {
      console.error("Failed to add specialty.", error);
      toast.error(error.message || "Failed to add specialty.");
    },
  });

  const getIntialValues = (
    specialty: ICreateSpecialtyPayload | null,
  ): ICreateSpecialtyFormValues => ({
    title: specialty?.title ?? "Specialty",
    description: specialty?.description ?? "",
    icon: specialty?.icon ?? "",
  });

  const form = useForm({
    defaultValues: getIntialValues(specialty),
    validators: {
      onSubmit: createSpecialtyZodSchema,
    },
    onSubmit: async ({ value }) => {
      if (!specialty) return;
      const parsedData = createSpecialtyZodSchema.safeParse(value);
      if (!parsedData.success) {
        console.error("Data parsing error: ", parsedData.error.issues);
        return;
      }

      await editSpecialtyMutation.mutateAsync({
        id: specialty.id,
        payload: parsedData.data,
      });
    },
  });

  useEffect(() => {
    if (specialty && open) {
      form.reset(getIntialValues(specialty));
    }
  }, [open, form, specialty]);

  return (
    <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit specialty
          </DialogTitle>
          <DialogDescription>Edit medical department</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="title">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Name"
                  value={field.state.value}
                  placeholder="e.g. Dermatology"
                  autoComplete={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="description">
              {(field) => (
                <FormInput
                  name={field.name}
                  label="Description"
                  value={field.state.value ?? ""}
                  placeholder="Add a short description"
                  autoComplete={field.name}
                  type="textarea"
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                />
              )}
            </form.Field>
            <form.Field name="icon">
              {(field) => (
                <SpecialtyIconPicker
                  value={field.state.value ?? ""}
                  onChange={field.handleChange}
                />
              )}
            </form.Field>
          </FieldGroup>
          {editSpecialtyMutation.isError && (
            <div
              className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              {editSpecialtyMutation.error.message ||
                "Unable to create specialty"}
            </div>
          )}
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <form.Subscribe>
              <Button type="submit" disabled={editSpecialtyMutation.isPending}>
                {editSpecialtyMutation.isPending ? (
                  <span className="flex gap-2 items-center">
                    <PenLine data-icon="inline-start" />
                    Updating Specialty...
                  </span>
                ) : (
                  <span className="flex gap-2 items-center">
                    <PenLine data-icon="inline-start" />
                    Update Specialty
                  </span>
                )}
              </Button>
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
