import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import { getDoctors } from "@/services/doctor.services";
import { getSpecialties } from "@/services/specialty.services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export default function DoctorsManagementPage() {
  return (
    <Suspense fallback="Loading doctors...">
      <DoctorsWithData />
    </Suspense>
  );
}

async function DoctorsWithData() {
  const queryClient = new QueryClient();
  await queryClient.query({
    queryKey: ["admin-doctors-data"],
    queryFn: getDoctors,
    staleTime: 60_000,
  });

  await queryClient.query({
    queryKey: ["admin-specialties"],
    queryFn: getSpecialties,
    staleTime: 60_000,
  });

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
