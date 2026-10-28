import { UserStatus } from "@/app/types/doctor.types";
import { Badge } from "@/components/ui/badge";

interface IStatusBadgeCellProps {
  status: UserStatus;
}

function StatusBadgeCell({ status }: IStatusBadgeCellProps) {
  return (
    <Badge
      variant={
        status === UserStatus.ACTIVE
          ? "default"
          : status === UserStatus.BLOCKED
            ? "destructive"
            : "secondary"
      }
    >
      <span className="text-sm capitalize">{status.toLowerCase()}</span>
    </Badge>
  );
}

export default StatusBadgeCell;
