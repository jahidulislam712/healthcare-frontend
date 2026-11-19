"use client";

import { IDoctor } from "@/app/types/doctor.types";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./DoctorsColumns";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/doctor.services";
import { CreateDoctorFormModal } from "./CreateDoctorFormModal";
import { getSpecialties } from "@/services/specialty.services";
import { useState } from "react";
import ViewDoctorModal from "./ViewDoctorModal";
import { EditDoctorFormModal } from "./EditDoctorFormModal";

function DoctorsTable() {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDoctor, SetSelectedDoctor] = useState<IDoctor | null>(null);

  const { data: doctorData, isLoading: loadingDoctors } = useQuery({
    queryKey: ["admin-doctors-data"],
    queryFn: getDoctors,
    staleTime: 60_000,
  });

  const { data: specialtiesData, isLoading: loadingSpecialties } = useQuery({
    queryKey: ["admin-specialties"],
    queryFn: () => getSpecialties({ limit: 100 }),
    staleTime: 60_000,
  });

  const doctors = doctorData?.data || [];
  const specialties = specialtiesData?.data || [];

  // console.log("Cached doctors", queryClient.getQueryData(['admin-doctors-data']))
  // console.log("Query state", queryClient.getQueryState(['admin-doctors-data']))

  const handleView = (doctor: IDoctor) => {
    SetSelectedDoctor(doctor);
    setViewOpen(true);
  };
  const handleEdit = (doctor: IDoctor) => {
    SetSelectedDoctor(doctor);
    setEditOpen(true);
  };
  const handleDelete = (doctor: IDoctor) => {
    console.log("Delete", doctor);
  };

  return (
    <>
      {loadingDoctors || loadingSpecialties ? (
        "Loading..."
      ) : (
        <DataTable
          data={doctors}
          columns={columns}
          actions={{
            onView: handleView,
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
          emptyMessage="No Records."
          toolbarAction={<CreateDoctorFormModal specialties={specialties} />}
        />
      )}

      <ViewDoctorModal
        doctor={selectedDoctor}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <EditDoctorFormModal
        doctor={selectedDoctor}
        specialties={specialties}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

export default DoctorsTable;
