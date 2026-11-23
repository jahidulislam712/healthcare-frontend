"use client";

import { Gender, IDoctor } from "@/app/types/doctor.types";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./DoctorsColumns";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/doctor.services";
import { CreateDoctorFormModal } from "./CreateDoctorFormModal";
import { getSpecialties } from "@/services/specialty.services";
import { useState } from "react";
import ViewDoctorModal from "./ViewDoctorModal";
import { EditDoctorFormModal } from "./EditDoctorFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DoctorsTable() {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDoctor, SetSelectedDoctor] = useState<IDoctor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [specialtyTitle, setSpecialtyTitle] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const params = {
    searchTerm,
    page,
    limit,
    ...(gender ? { gender } : {}),
    ...(specialtyTitle
      ? { "specialties.specialty.title": specialtyTitle }
      : {}),
  };

  const {
    data: doctorData,
    isLoading: loadingDoctors,
    isFetching: fetchingDoctors,
    isError: doctorsError,
    error: doctorsQueryError,
  } = useQuery({
    queryKey: ["admin-doctors-data", params],
    queryFn: () => getDoctors(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const {
    data: specialtiesData,
    isLoading: loadingSpecialties,
    isError: specialtiesError,
    error: specialtiesQueryError,
  } = useQuery({
    queryKey: ["admin-specialties"],
    queryFn: () => getSpecialties({ limit: 100 }),
    staleTime: 60_000,
  });

  const doctors = doctorData?.data || [];
  const specialties = specialtiesData?.data || [];
  const meta = doctorData?.meta;

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
      {doctorsError || specialtiesError ? (
        <div
          className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          {doctorsQueryError?.message ||
            specialtiesQueryError?.message ||
            "Unable to load doctors."}
        </div>
      ) : loadingDoctors || loadingSpecialties ? (
        "Loading..."
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              className="sm:max-w-sm"
              value={searchTerm}
              placeholder="Search doctors..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
            />
            <Select
              value={gender || "all"}
              onValueChange={(value) => {
                setGender(
                  Object.values(Gender).find(
                    (genderOption) => genderOption === value,
                  ) ?? "",
                );
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                {Object.values(Gender).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value.charAt(0) + value.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={specialtyTitle || "all"}
              onValueChange={(value) => {
                setSpecialtyTitle(value === "all" ? "" : value ?? "");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="All specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.title}>
                    {specialty.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateDoctorFormModal specialties={specialties} />
          </div>
          <div aria-busy={fetchingDoctors}>
            <DataTable
              data={doctors}
              columns={columns}
              actions={{
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
              }}
              emptyMessage="No Records."
              showSearch={false}
              showPagination={false}
            />
          </div>
          <div className="flex items-center justify-between border-t py-3 text-sm">
            <span className="text-muted-foreground">
              {meta?.total ?? 0} doctor{meta?.total === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                Page {meta?.page ?? page} of {meta?.totalPages ?? 0}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={!meta || fetchingDoctors || meta.page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={
                  !meta || fetchingDoctors || meta.page >= meta.totalPages
                }
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
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
