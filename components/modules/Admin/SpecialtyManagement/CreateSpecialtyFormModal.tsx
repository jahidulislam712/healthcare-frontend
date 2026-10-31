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
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { Plus, PlusIcon } from "lucide-react";
import { SpecialtyIconPicker } from "./SpecialtyIconPicker";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { createSpecialty } from "@/services/specialty.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function CreateSpecialtyFormModal() {
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const createSpecialtyMutation = useMutation({
    mutationFn: createSpecialty,
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

  const defaultValues: ICreateSpecialtyFormValues = {
    title: "",
    description: "",
    icon: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createSpecialtyZodSchema,
    },
    onSubmit: async ({ value }) => {
      const parsedData = createSpecialtyZodSchema.safeParse(value);
      if (!parsedData.success) {
        console.error("Data parsing error: ", parsedData.error.issues);
        return;
      }

      const payload: ICreateSpecialtyPayload = parsedData.data;

      await createSpecialtyMutation.mutateAsync(payload);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4.5" /> Add specialty
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add specialty
          </DialogTitle>
          <DialogDescription>
            Create a new medical department.
          </DialogDescription>
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
          {createSpecialtyMutation.isError && (
            <div
              className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              {createSpecialtyMutation.error.message ||
                "Unable to create specialty"}
            </div>
          )}
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <form.Subscribe>
              <Button
                type="submit"
                disabled={createSpecialtyMutation.isPending}
              >
                {createSpecialtyMutation.isPending ? (
                  <span className="flex gap-2 items-center">
                    <Spinner data-icon="inline-start" />
                    Adding Specialty...
                  </span>
                ) : (
                  <span className="flex gap-2 items-center">
                    <PlusIcon data-icon="inline-start" />
                    Add Specialty
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
