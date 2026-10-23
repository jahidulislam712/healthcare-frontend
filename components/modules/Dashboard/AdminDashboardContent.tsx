import { ApiResponse } from "@/app/types/api.types";
import { IAdminDashboardData } from "@/app/types/dashboard.types";
import { AppointmentPieChart } from "@/components/shared/AppointmentPieChart";
import StatsCard from "@/components/shared/StatsCard";
import { getDashboardData } from "@/services/dashboard.services";
import { noop, QueryClient } from "@tanstack/react-query";

async function AdminDashboardContent() {
  const queryClient = new QueryClient();
  await queryClient
    .query({
      queryKey: ["admin-dashboard-data"],
      queryFn: getDashboardData,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    })
    .catch(noop);

  const dashboardData = queryClient.getQueryData([
    "admin-dashboard-data",
  ]) as ApiResponse;

  const { data } = dashboardData as ApiResponse<IAdminDashboardData>;

  const pieChartData = data?.pieChartData || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <StatsCard
        title="Total Admin"
        value={data?.adminCount || 0}
        iconName="Users"
        description="Description goes here"
        className=""
      ></StatsCard>
      <StatsCard
        title="Total Doctors"
        value={data?.doctorCount || 0}
        iconName="Stethoscope"
        description="Description goes here"
        className=""
      ></StatsCard>
      <StatsCard
        title="Total Patients"
        value={data?.patientCount || 0}
        iconName="Stethoscope"
        description="Description goes here"
        className=""
      ></StatsCard>
      <StatsCard
        title="Total Users"
        value={data?.userCount || 0}
        iconName="Stethoscope"
        description="Description goes here"
        className=""
      ></StatsCard>
      <StatsCard
        title="Total Revenue"
        value={data?.totalRevenue || 0}
        iconName="Stethoscope"
        description="Description goes here"
        className=""
      ></StatsCard>
      <AppointmentPieChart
        title="Appointment Payments"
        description="Paid VS. unpaid appointments"
        chartData={pieChartData}
      />
    </div>
  );
}

export default AdminDashboardContent;
