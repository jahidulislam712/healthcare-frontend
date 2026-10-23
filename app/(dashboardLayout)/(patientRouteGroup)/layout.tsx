import type { ReactNode } from "react";

function PatientDashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
    </>
  );
}

export default PatientDashboardLayout;
