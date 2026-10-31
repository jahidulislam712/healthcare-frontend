export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DoctorSpecialties {
  id: string;
  doctorId: string;
  specialtyId: string;
}

export interface ISpecialty {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  doctorSpecialties?: DoctorSpecialties[];
}

export interface SpecialtyListResult {
  data: ISpecialty[];
  meta: PaginationMeta;
}

export interface SpecialtyQueryParams extends Record<string, unknown> {
  searchTerm?: string;
  page?: number;
  limit?: number;
}
