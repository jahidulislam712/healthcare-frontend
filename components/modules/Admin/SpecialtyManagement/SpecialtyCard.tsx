import { ISpecialty } from "@/app/types/specialty.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/lib/iconMapper";
import { MoreHorizontal } from "lucide-react";

type SpecialtyCardProps = {
  key: string;
  data: ISpecialty;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onEdit: (specialty: ISpecialty) => void;
};

export default function SpecialtyCard({
  key,
  data: item,
  onDelete,
  isDeleting,
  onEdit,
}: SpecialtyCardProps) {
  return (
    <Card
      key={key}
      className="group rounded-lg transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
    >
      <CardHeader className="pb-3">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name={item.icon || "Stethoscope"} className="size-5" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label={`More actions for ${item.title}`}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => onDelete(item.id)}
                  variant="destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle className="text-base font-semibold mb-2">
          {item.title}
        </CardTitle>

        <p className="line-clamp-2 min-h-8 text-sm text-muted-foreground">
          {item.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="border-t border-border pt-2">
          <p className="text-sm font-bold">
            {item.doctorSpecialties?.length ?? 0}
          </p>
          <p className="text-[10px] text-muted-foreground">Doctors</p>
        </div>
      </CardContent>
    </Card>
  );
}
