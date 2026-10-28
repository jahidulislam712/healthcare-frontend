import { features } from "@/components/shared/data-table/table.features";
import { createColumnHelper } from "@tanstack/react-table";
import { IDoctor } from "@/app/types/doctor.types";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { formatDate } from "date-fns";

const columnHelper = createColumnHelper<typeof features, IDoctor>();
export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => {
      return (
        <UserInfoCell
          email={info.row.original.email}
          name={info.row.original.name}
          profilePhoto={info.row.original.profilePhoto}
        />
      );
    },
  }),
  columnHelper.accessor("specialties", {
    id: "specialties",
    header: "Specialties",
    enableSorting: false,
    cell: ({ row }) => {
      const specialties = row.original.specialties;
      if (!specialties || specialties.length === 0)
        return (
          <span className="text-xs text-muted-foreground">No Specialties</span>
        );
      return (
        <div>
          {specialties.map(({ specialty }, id) => {
            const title = specialty.title || "N/A";
            return (
              <Badge variant={"secondary"} key={id}>
                {title}
              </Badge>
            );
          })}
        </div>
      );
    },
  }),
  columnHelper.accessor("averageRating", {
    id: "averageRating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">
          {row.original.averageRating?.toFixed(1) || 0.0}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("contactNumber", {
    id: "contactNumber",
    header: "Contact",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original?.contactNumber || "N/A"}</span>
      </div>
    ),
  }),
  columnHelper.accessor("experience", {
    id: "experience",
    header: "Experience",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.experience ?? 0} years
      </span>
    ),
  }),
  columnHelper.accessor("appointmentFee", {
    id: "appointmentFee",
    header: "Fee",
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-green-600">
        ${row.original?.appointmentFee.toFixed(2) ?? "N/A"}
      </span>
    ),
  }),
  columnHelper.accessor("gender", {
    id: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <span className="text-sm capitalize">
        {row.original.gender.toLowerCase()}
      </span>
    ),
  }),
  columnHelper.accessor("user.status", {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.user.status} />,
  }),
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: "Joined On",
    cell: (info) => {
      const value = info.getValue();
      return value ? formatDate(new Date(value), "MMM dd, yyyy") : "N/A";
    },
  }),
]);
