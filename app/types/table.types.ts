import { DataTableFeatures } from "@/components/shared/data-table/table.features";
import { ColumnDef, RowData } from "@tanstack/react-table";

export interface DataTableActions<TData> {
  onView?: (data: TData) => void;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
}

export interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<DataTableFeatures, TData, unknown>[];
  actions?: DataTableActions<TData>;
  emptyMessage?: string;
  isLoading?: boolean;
}
