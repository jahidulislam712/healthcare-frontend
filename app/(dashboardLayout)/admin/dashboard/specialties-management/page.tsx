import SpecialtyManagementContent from "@/components/modules/Admin/SpecialtyManagement/SpecialtyManagementContent";
import { getSpecialties } from "@/services/specialty.services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export default function SpecialtiesManagementPage() {
  return (
    <Suspense fallback="Specialties loading...">
      <SpecialtyManagementWithData />
    </Suspense>
  );
}

const intialParams = {
  searchTerm: "",
  limit: 8,
  page: 1,
};
async function SpecialtyManagementWithData() {
  const queryClient = new QueryClient();
  await queryClient.query({
    queryKey: ["admin-specialties", intialParams],
    queryFn: () => getSpecialties(intialParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpecialtyManagementContent />
    </HydrationBoundary>
  );
}
