import DoctorsManagementContent from "@/components/modules/Admin/DoctorsManagement/DoctorsManagementContent";
import { Suspense } from "react";

async function DoctorsManagementPage() {
  return (
    <Suspense fallback="Doctor management content loading...">
      <DoctorsManagementContent />
    </Suspense>
  );
}

export default DoctorsManagementPage;
