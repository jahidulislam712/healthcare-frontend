import {
  dehydrate,
  HydrationBoundary,
  noop,
  QueryClient,
} from "@tanstack/react-query";
import { getDoctors } from "./_action";
import DoctorList from "@/components/modules/Consultation/DoctorList";
import { Suspense } from "react";

const DoctorsWithPrefetchData = async () => {
  const queryClient = new QueryClient();

  await queryClient
    .query({
      queryKey: ["doctors"],
      queryFn: getDoctors,
    })
    .catch(noop);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorList />
    </HydrationBoundary>
  );
};

async function consultationPage() {
  return (
    <Suspense fallback={'loading doctors...'}>
      <DoctorsWithPrefetchData/>
    </Suspense>
  );
}

export default consultationPage;
