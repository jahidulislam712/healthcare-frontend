import { getDoctors } from "@/services/doctor.services";
import { noop, QueryClient } from "@tanstack/react-query";
import DoctorsTable from "./DoctorsTable";

async function DoctorsManagementContent() {
  const queryClient = new QueryClient();
  await queryClient
    .query({
      queryKey: ["admin-doctor-data"],
      queryFn: getDoctors,
    })
    .catch(noop);

  const result = queryClient.getQueryData<
    Awaited<ReturnType<typeof getDoctors>>
  >(["admin-doctor-data"]);

  return <DoctorsTable doctor={result?.data ?? []} />;
}

export default DoctorsManagementContent;
