"use client";

import { Button } from "@/components/ui/button";
import { deleteSpecialty, getSpecialties } from "@/services/specialty.services";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateSpecialtyFormModal } from "./CreateSpecialtyFormModal";
import { useState } from "react";
import { EditSpecialtyFormModal } from "./EditSpecialtyFormModal";
import { ISpecialty } from "@/app/types/specialty.types";
import { toast } from "sonner";
import SpecialtySkeleton from "./SpecialtySkeleton";
import SpecialtyCard from "./SpecialtyCard";
import { Search } from "lucide-react";

export default function SpecialtyManagementContent() {
  const [open, setOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<ISpecialty | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const params = { searchTerm, page, limit };
  const { data, isFetching } = useQuery({
    queryKey: ["admin-specialties", params],
    queryFn: () => getSpecialties(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const specialties = data?.data ?? [];
  const meta = data?.meta;

  // const {
  //   data: { data: specialties, meta },
  // } = useSuspenseQuery({
  //   queryKey: ["admin-specialties", params],
  //   queryFn: () => getSpecialties(params),
  //   staleTime: 60_000,
  // });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteSpecialty,
    onSuccess: async () => {
      toast.success("Specialty deleted successfully!");
      await queryClient.invalidateQueries({ queryKey: ["admin-specialties"] });
    },

    onError: (error) => {
      toast.error(
        error.message || "Failed to delete specialty. Please try again.",
      );
      console.error("Failed to delete specialty", error);
    },
  });

  const handleDelete = async (id: string) => {
    try {
      toast.warning("Are you sure you want to delete this specialty?", {
        action: {
          label: "Delete",
          onClick: () => {
            toast.promise(deleteMutation.mutateAsync(id), {
              loading: "Deleting specialty...",
              success: "Specialty deleted successfully.",
              error: (error) => error.message || "Failed to delete specialty",
            });
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {},
        },
        duration: 5000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEdit = (specialty: ISpecialty) => {
    setOpen(true);
    setSelectedSpecialty(specialty);
  }

  return (
    <div>
      <div className="">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Specialties
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Manage medical departments and their specialties.
            </p>
          </div>
        </div>

        <div className="">
          <div className="mb-5  pb-5 flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search specialties..."
                className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none transition  focus:ring-2"
              />
            </div>
            <CreateSpecialtyFormModal />
          </div>
          <div className="relative" aria-busy={isFetching}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {specialties.length > 0 ? (
                specialties.map((item) => (
                  <SpecialtyCard
                    key={item.id}
                    data={item}
                    onDelete={handleDelete}
                    isDeleting={deleteMutation.isPending}
                    onEdit={handleEdit}/>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-sm text-slate-500">
                  No specialties match found.
                </div>
              )}
            </div>
            {isFetching && (
              <div className="absolute inset-0 z-10 rounded-lg bg-background/70 backdrop-blur-[1px]">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: limit }).map((_, index) => (
                    <SpecialtySkeleton key={index} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t py-4 text-xs mt-8">
            <span>
              Showing {specialties.length} on page {meta?.page} of {meta?.total}{" "}
              specialties
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta || isFetching || meta.page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>

              <span>
                Page {meta?.page} of {meta?.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={!meta || isFetching || meta.page >= meta.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          {/* form modal */}
          <EditSpecialtyFormModal
            open={open}
            setOpen={setOpen}
            specialty={selectedSpecialty}
          />
        </div>
      </div>
    </div>
  );
}
