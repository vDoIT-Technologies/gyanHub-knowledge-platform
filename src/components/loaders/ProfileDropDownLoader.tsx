import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function ProfileDropdownSkeleton() {
  return (
    <div className="flex items-center h-full rounded-none gap-4">
      <Skeleton className="h-6 w-24 bg-muted/20 rounded-md" />
      <div className="w-10 h-10">
        <Avatar>
          <Skeleton className="w-full h-full rounded-full bg-muted/20" />
        </Avatar>
      </div>
    </div>
  );
}
