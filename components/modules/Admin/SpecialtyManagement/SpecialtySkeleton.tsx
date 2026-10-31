import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpecialtySkeleton() {
  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-3">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="size-12 rounded-lg" />
          <Skeleton className="size-7 rounded-md" />
        </div>

        <Skeleton className="mb-3 h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>

      <CardContent className="pt-0">
        <div className="border-t border-border pt-2">
          <Skeleton className="mb-2 h-5 w-10" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
