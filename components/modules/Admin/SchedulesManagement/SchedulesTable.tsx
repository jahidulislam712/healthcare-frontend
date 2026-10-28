"use client";

import { ISchedule } from "@/app/types/schedule.types";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./ScheduleColumns";

function SchedulesTable({ schedules }: { schedules: ISchedule[] }) {
  return (
    <div>
      <DataTable data={schedules} columns={columns} />
    </div>
  );
}

export default SchedulesTable;
