import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import { getDoctors } from "@/services/doctor.services";
import { getSpecialties } from "@/services/specialty.services";
import { DoctorQueryParams } from "@/app/types/doctor.types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

const initialDoctorParams: DoctorQueryParams = {
  searchTerm: "",
  page: 1,
  limit: 10,
};

export default function DoctorsManagementPage() {
  return (
    <Suspense fallback="Loading doctors...">
      <DoctorsWithData />
    </Suspense>
  );
}

async function DoctorsWithData() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.query({
      queryKey: ["admin-doctors-data", initialDoctorParams],
      queryFn: () => getDoctors(initialDoctorParams),
      staleTime: 60_000,
    }),
    
    queryClient.query({
      queryKey: ["admin-specialties"],
      queryFn: () => getSpecialties({ limit: 100 }),
      staleTime: 60_000,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="">
        <div className="mb-5">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            All Doctors
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage doctor from below complete list of active doctors
          </p>
        </div>
        <DoctorsTable />
      </div>
    </HydrationBoundary>
  );
}
