export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT"

export interface ILoginResponse {
  user: {
    needPasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    image: string;
    status: string;
    isDeleted: boolean;
    emailVerified: boolean;
  };
}

export interface UserInfo{
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  doctor?: unknown;
  patient?: unknown;
  admin?: unknown;
}