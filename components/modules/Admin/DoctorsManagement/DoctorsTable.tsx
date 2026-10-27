"use client";

import { IDoctor } from "@/app/types/doctor.types";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { info } from "console";

function DoctorsTable({ data }: { data: IDoctor[] }) {
  const features = tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortFns: {
      alphanumeric: sortFn_alphanumeric,
      text: sortFn_text,
    },
    filterFns: {
      includesString: filterFn_includesString,
    },
  });

  const columnHelper = createColumnHelper<typeof features, IDoctor>();

  const columns = columnHelper.columns([
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
    columnHelper.accessor("email", {
      id: "email",
      header: "Email",
    }),
    columnHelper.accessor("specialties", {
      id: "specialties",
      header: "Specialties",
      cell: ({ row }) => {
        const specialties = row.original.specialties;
        if (!specialties || specialties.length === 0)
          return (
            <span className="text-xs text-muted-foreground">
              No Specialties
            </span>
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
  ]);

  const table = useTable(
    {
      debugTable: true,
      features,
      columns,
      data,
      globalFilterFn: "includesString",
    },
    (state) => state,
  );

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id}>
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DoctorsTable;
