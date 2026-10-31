import z from "zod";
import { Gender } from "../types/doctor.types";

export const createDoctorFormSchema = z.object({
  password: z.string().min(8, {
    error: (issue) =>
      issue.input === ""
        ? "Password is required"
        : "Password must be at least 8 characters long",
  }),

  name: z
    .string()
    .trim()
    .min(3, {
      error: (issue) =>
        issue.input === ""
          ? "Name is required"
          : "Name must be at least 3 characters long",
    })
    .max(100, "Name cannot exceed 100 characters"),

  email: z.email("Invalid email address").toLowerCase(),

  profilePhoto: z.url("Profile photo must be a valid URL").optional(),

  contactNumber: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\+?[0-9\s()-]{7,20}$/.test(value),
      "Invalid contact number",
    )
    .transform((value) => value || undefined)
    .optional(),

  address: z
    .string()
    .trim()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .max(50, "Registration number cannot exceed 50 characters"),

  experience: z.coerce
    .number()
    .int("Experience must be a whole number")
    .min(0, "Experience cannot be negative")
    .max(80, "Experience cannot exceed 80 years"),

  gender: z.enum(Gender, {
    message: "Please select a valid gender",
  }),

  appointmentFee: z.coerce
    .number()
    .nonnegative("Appointment fee cannot be negative"),

  qualification: z
    .string()
    .trim()
    .min(1, "Qualification is required")
    .max(200, "Qualification cannot exceed 200 characters"),

  currentWorkingPlace: z
    .string()
    .trim()
    .min(1, "Current working place is required")
    .max(200, "Current working place cannot exceed 200 characters"),

  designation: z
    .string()
    .trim()
    .min(1, "Designation is required")
    .max(100, "Designation cannot exceed 100 characters"),

  specialties: z
    .array(z.uuid("Each specialty must be a valid UUID"))
    .min(1, "At least one specialty is required")
    .max(20, "You can select at most 20 specialties")
    .refine(
      (specialties) => new Set(specialties).size === specialties.length,
      "Duplicate specialties are not allowed",
    ),
});

export const createDoctorPayloadSchema = z.object({
  password: z.string().min(8, {
    error: (issue) =>
      issue.input === ""
        ? "Password is required"
        : "Password must be at least 8 characters long",
  }),

  doctor: z.object({
    name: z
      .string()
      .trim()
      .min(3, {
        error: (issue) =>
          issue.input === ""
            ? "Name is required"
            : "Name must be at least 3 characters long",
      })
      .max(100, "Name cannot exceed 100 characters"),

    email: z.email("Invalid email address").toLowerCase(),

    profilePhoto: z.url("Profile photo must be a valid URL").optional(),

    contactNumber: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || /^\+?[0-9\s()-]{7,20}$/.test(value),
        "Invalid contact number",
      )
      .transform((value) => value || undefined)
      .optional(),

    address: z
      .string()
      .trim()
      .max(255, "Address cannot exceed 255 characters")
      .optional(),

    registrationNumber: z
      .string()
      .trim()
      .min(1, "Registration number is required")
      .max(50, "Registration number cannot exceed 50 characters"),

    experience: z.coerce
      .number()
      .int("Experience must be a whole number")
      .min(0, "Experience cannot be negative")
      .max(80, "Experience cannot exceed 80 years"),

    gender: z.enum(Gender, {
      message: "Please select a valid gender",
    }),

    appointmentFee: z.coerce
      .number()
      .nonnegative("Appointment fee cannot be negative"),

    qualification: z
      .string()
      .trim()
      .min(1, "Qualification is required")
      .max(200, "Qualification cannot exceed 200 characters"),

    currentWorkingPlace: z
      .string()
      .trim()
      .min(1, "Current working place is required")
      .max(200, "Current working place cannot exceed 200 characters"),

    designation: z
      .string()
      .trim()
      .min(1, "Designation is required")
      .max(100, "Designation cannot exceed 100 characters"),
  }),

  specialties: z
    .array(z.uuid("Each specialty must be a valid UUID"))
    .min(1, "At least one specialty is required")
    .max(20, "You can select at most 20 specialties")
    .refine(
      (specialties) => new Set(specialties).size === specialties.length,
      "Duplicate specialties are not allowed",
    ),
});

export type ICreateDoctorFormValues = z.input<typeof createDoctorFormSchema>;
export type ICreateDoctorPayload = z.output<typeof createDoctorPayloadSchema>;

export const createDoctorSubmissionSchema = createDoctorFormSchema.transform(
  (vaules) => ({
    password: vaules.password,
    doctor: {
      name: vaules.name,
      email: vaules.email,
      profilePhoto: vaules.profilePhoto || undefined,
      contactNumber: vaules.contactNumber || undefined,
      address: vaules.address || undefined,
      registrationNumber: vaules.registrationNumber,
      experience: vaules.experience,
      gender: vaules.gender,
      appointmentFee: vaules.appointmentFee,
      qualification: vaules.qualification,
      currentWorkingPlace: vaules.currentWorkingPlace,
      designation: vaules.designation,
    },
    specialties: vaules.specialties
  }),
);
