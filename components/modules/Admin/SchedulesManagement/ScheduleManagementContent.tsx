import { noop, QueryClient } from "@tanstack/react-query";
import { getSchedules } from "@/services/schedule.services";
import SchedulesTable from "./SchedulesTable";

async function SchedulesManagementContent() {
  const queryClient = new QueryClient();
  await queryClient
    .query({
      queryKey: ["admin-schedules-data"],
      queryFn: getSchedules,
    })
    .catch(noop);

  const result = queryClient.getQueryData<
    Awaited<ReturnType<typeof getSchedules>>
  >(["admin-schedules-data"]);

  return <SchedulesTable schedules={result?.data ?? []} />;
}

export default SchedulesManagementContent;
