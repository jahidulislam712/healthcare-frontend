import AdminDashboardContent from "@/components/modules/Dashboard/AdminDashboardContent";
import { Suspense } from "react";

async function AdminDashboardPage() {
  return (
    <Suspense fallback="loading admin dashboard...">
      <AdminDashboardContent />
    </Suspense>
  );
}

export default AdminDashboardPage;
