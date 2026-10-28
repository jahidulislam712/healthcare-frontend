import SchedulesManagementContent from "@/components/modules/Admin/SchedulesManagement/ScheduleManagementContent";
import { Suspense } from "react";

function SchedulesManagementPage() {
  return (
    <Suspense fallback="Loading schedules...">
      <SchedulesManagementContent />
    </Suspense>
  );
}

export default SchedulesManagementPage;
