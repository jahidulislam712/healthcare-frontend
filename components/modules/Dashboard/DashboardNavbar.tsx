import { getCurrentUser, getDefaultDashboarRoute } from "@/lib/userUtils";
import DashboardNavbarContent from "./DashboardNavbarContent";
import { redirect } from "next/navigation";
import { getNavMenusByRole } from "@/lib/navItems";

async function DashboardNavbar() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const navItems = getNavMenusByRole(user.role);
  const dashboardHome = getDefaultDashboarRoute(user.role);
  return (
    <DashboardNavbarContent
      user={user}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
}

export default DashboardNavbar;
