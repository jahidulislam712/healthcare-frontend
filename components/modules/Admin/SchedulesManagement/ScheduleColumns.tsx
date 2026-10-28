import { ISchedule } from "@/app/types/schedule.types";
import { features } from "@/components/shared/data-table/table.features";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<typeof features, ISchedule>()
export const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    id: 'scheduleId',
    header: "Schedule ID",
    enableSorting: false
  }),
  columnHelper.accessor('startDateTime', {
    id: 'startDateTime',
    header: "Start DateTime"
  }),
  columnHelper.accessor('endDateTime', {
    id: 'endDateTime',
    header: "End DateTime"
  }),
])