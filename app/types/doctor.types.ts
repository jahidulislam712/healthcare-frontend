import { UserRole } from "./auth.types";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface IDoctor {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  gender: Gender;
  registrationNumber: string;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  averageRating: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    status: UserStatus;
    role: string;
    emailVerified: boolean;
    needPasswordChange: boolean;
  };
  specialties: Array<{
    specialtyId: string;
    docorId: string;
    specialty: {
      id: string;
      title: string;
      description: string;
      icons: string;
    };
  }>;
}
