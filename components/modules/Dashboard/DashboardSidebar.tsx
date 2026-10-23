
import DashboardSidebarContent from "./DashboardSidebarContent";
import { redirect } from "next/navigation";
import { getNavMenusByRole } from "@/lib/navItems";
import { getCurrentUser, getDefaultDashboarRoute } from "@/lib/userUtils";

async function DashboardSidebar() {
  const user = await getCurrentUser()
  if( !user ){
    redirect('/login')
  }

  const dashboardHome = getDefaultDashboarRoute(user.role)

  const navItems = getNavMenusByRole(user.role)
  return (
    <DashboardSidebarContent user={user} navItems={navItems} dashboardHome={dashboardHome} />
  );
}

export default DashboardSidebar;
