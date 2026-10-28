import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createColumnHelper, RowData, useTable } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";
import { DataTableProps } from "@/app/types/table.types";
import { features } from "./data-table/table.features";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DebouncedInput from "./DebouncedInput";

function DataTable<TData extends RowData>({
  data,
  columns,
  actions,
  emptyMessage = "No Results.",
  isLoading = false,
}: DataTableProps<TData>) {
  const columnHelper = createColumnHelper<typeof features, TData>();

  const hasActions = actions?.onDelete || actions?.onEdit || actions?.onView;

  const tableColumns = hasActions
    ? [
        ...columns,
        columnHelper.display({
          id: "actions",
          header: "Actions",
          enableSorting: false,
          enableColumnFilter: false,
          cell: ({ row }) => {
            const item = row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Open actions</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  }
                />

                <DropdownMenuContent align="end">
                  {actions?.onView && (
                    <DropdownMenuItem onClick={() => actions.onView?.(item)}>
                      View
                    </DropdownMenuItem>
                  )}

                  {actions?.onEdit && (
                    <DropdownMenuItem onClick={() => actions.onEdit?.(item)}>
                      Edit
                    </DropdownMenuItem>
                  )}

                  {actions?.onDelete && (
                    <DropdownMenuItem onClick={() => actions.onDelete?.(item)}>
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        }),
      ]
    : columns;

  const table = useTable(
    {
      features,
      columns: tableColumns,
      data,
      globalFilterFn: "includesString",
    },
    (state) => state,
  );

  const tableRows = table.getRowModel().rows;
  const paginationRows = table.getPrePaginatedRowModel().rows;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <DebouncedInput
            value={table.state.globalFilter ?? ""}
            onChange={(value) => table.setGlobalFilter(String(value))}
            placeholder="Search all columns..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button>Create Doctor</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const Icon =
                    sorted === "asc"
                      ? ArrowUp
                      : sorted === "desc"
                        ? ArrowDown
                        : ArrowUpDown;
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-3 h-8 data-[state=open]:bg-accent"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          <Icon className="ml-2" />
                        </Button>
                      ) : (
                        <span className="text-sm font-medium">
                          <table.FlexRender header={header} />
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : tableRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              tableRows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination controls */}
        <div className="flex items-center justify-between gap-4 px-2 py-4">
          <div className="text-sm text-muted-foreground">
            {paginationRows.length && paginationRows.length > 0
              ? `${paginationRows.length.toLocaleString()} of ${data.length.toLocaleString()} rows`
              : null}
          </div>
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.state.pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-17.5">
                  <SelectValue
                    placeholder={`${table.state.pagination.pageSize}`}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                  <SelectItem value="Infinity">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-25 items-center justify-center text-sm font-medium">
              Page {table.state.pagination.pageIndex + 1} of{" "}
              {Math.max(1, table.getPageCount())}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.lastPage()}
                disabled={!table.getCanLastPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
