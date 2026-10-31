"use client";

import { IDoctor } from "@/app/types/doctor.types";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./DoctorsColumns";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/doctor.services";
import { CreateDoctorFormModal } from "./CreateDoctorFormModal";
import { getSpecialties } from "@/services/specialty.services";
import { ViewDoctorModal } from "./ViewDoctorModal";

function DoctorsTable() {
  const { data: doctorData, isLoading: loadingDoctors } = useQuery({
    queryKey: ["admin-doctors-data"],
    queryFn: getDoctors,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  const { data: specialtiesData, isLoading: loadingSpecialties } = useQuery({
    queryKey: ["admin-specialties"],
    queryFn: getSpecialties,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  const doctors = doctorData?.data || [];
  const specialties = specialtiesData?.data || [];

  // console.log("Cached doctors", queryClient.getQueryData(['admin-doctors-data']))
  // console.log("Query state", queryClient.getQueryState(['admin-doctors-data']))

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
    </>
  );
}

export default DoctorsTable;
