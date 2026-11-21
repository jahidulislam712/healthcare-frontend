import { getCurrentUser } from "@/lib/userUtils";
import { getDefaultDashboarRoute } from "@/lib/dashboardRoutes";
import { redirect } from "next/navigation";

export default async function PageManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect(getDefaultDashboarRoute(user.role));
  }

  return children;
}
