"use client";

import { IDoctor } from "@/app/types/doctor.types";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./DoctorsColumns";

function DoctorsTable({ doctor }: { doctor: IDoctor[] }) {
  const handleView = (doctor: IDoctor) => {
    console.log("View", doctor);
  };
  const handleEdit = (doctor: IDoctor) => {
    console.log("Edit", doctor);
  };
  const handleDelete = (doctor: IDoctor) => {
    console.log("Delete", doctor);
  };

  return (
    <DataTable
      data={doctor}
      columns={columns}
      actions={{
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }}
      emptyMessage="No Records."
    />
  );
}

export default DoctorsTable;
