import { Suspense } from "react";
import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import { NavbarSkeleton, SidebarSkeleton } from "@/components/modules/Dashboard/SidebarSkeleton";

function RootDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Dashboard Sidebar */}
      <Suspense
        fallback={<SidebarSkeleton/>}
      >
        <DashboardSidebar />
      </Suspense>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* DashboardNavbar */}
        <Suspense fallback={<NavbarSkeleton/>}>
          <DashboardNavbar />
        </Suspense>
        {/* Dashboard Content */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}

export default RootDashboardLayout;
