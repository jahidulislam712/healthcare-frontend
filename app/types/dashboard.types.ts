export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface IAdminDashboardData {
  adminCount: number;
  doctorCount: number;
  patientCount: number;
  userCount: number;
  totalRevenue: number;
  pieChartData: [];
  barChartData: [];
}
