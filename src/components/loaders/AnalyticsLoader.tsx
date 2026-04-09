import { Skeleton } from "@/components/ui/skeleton";

const AnalyticsSkeleton = () => {
  return (
    <div className="flex flex-col justify-between gap-5 w-full overflow-y-auto">
      <div className="flex justify-between gap-2 py-4">
        <Skeleton className="w-32 h-6 bg-muted/20 rounded-md" />
        <Skeleton className="w-36 h-10 bg-muted/20 rounded-md" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <Skeleton className="w-full h-24 lg:h-36 bg-muted/10 rounded-md" />
        <Skeleton className="w-full h-24 lg:h-36 bg-muted/10 rounded-md" />
        <Skeleton className="w-full h-24 lg:h-36 bg-muted/10 rounded-md" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <Skeleton className="w-full h-84 lg:h-99 bg-muted/10 rounded-md basis-3/4" />

        <div className="flex flex-col gap-2 w-full basis-1/2">
          <Skeleton className="h-10 bg-muted/20 rounded-md" />
          <Skeleton className="h-8 bg-muted/10 rounded-md" />
          <Skeleton className="h-8 bg-muted/10 rounded-md" />
          <Skeleton className="h-8 bg-muted/10 rounded-md" />
          <Skeleton className="h-8 bg-muted/10 rounded-md" />
          <Skeleton className="h-8 bg-muted/10 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
