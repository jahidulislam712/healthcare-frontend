import DashboardSidebarContent from "./DashboardSidebarContent";
import { redirect } from "next/navigation";
import { getNavMenusByRole } from "@/lib/navItems";
import { getCurrentUser, getDefaultDashboarRoute } from "@/lib/userUtils";

async function DashboardSidebar() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const dashboardHome = getDefaultDashboarRoute(user.role);

  const navItems = getNavMenusByRole(user.role);
  return (
    <aside className="hidden h-full w-64 shrink-0 border-r md:block">
      <DashboardSidebarContent
        user={user}
        navItems={navItems}
        dashboardHome={dashboardHome}
      />
    </aside>
  );
}

export default DashboardSidebar;
