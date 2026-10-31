import z from "zod";

export const createSpecialtyZodSchema = z.object({
  title: z
    .string("Specialty name must be string")
    .trim()
    .min(1, "Specialty name is required.")
    .max(100, "Specialty name cannot exceed 100 characters"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export type ICreateSpecialtyFormValues = z.input<
  typeof createSpecialtyZodSchema
>;
export type ICreateSpecialtyPayload = z.output<typeof createSpecialtyZodSchema>;

export const editSpecialtyZodSchema = z.object({
  title: z
    .string("Specialty name must be string")
    .trim()
    .min(1, "Specialty name is required.")
    .max(100, "Specialty name cannot exceed 100 characters")
    .optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});
export type IEditSpecialtyFormValues = z.input<typeof editSpecialtyZodSchema>
export type IEditSpecialtyPayload = z.output<typeof editSpecialtyZodSchema>
