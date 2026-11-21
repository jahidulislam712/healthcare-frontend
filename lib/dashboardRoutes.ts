import type { UserRole } from "@/app/types/auth.types";

export const getDefaultDashboarRoute = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "DOCTOR":
      return "/doctor/dashboard";
    case "PATIENT":
      return "/dashboard";
    default:
      return "/";
  }
};
