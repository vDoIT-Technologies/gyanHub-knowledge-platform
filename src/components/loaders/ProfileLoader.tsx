import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col relative top-4 rounded-xl gap-4 justify-center items-center min-h-[80vh] bg-muted/10 px-4">
      <Skeleton className="w-44 h-44 rounded-full border-null overflow-hidden bg-muted/20" />
      <Skeleton className="w-32 h-6 rounded-md bg-muted/20" />
      <Skeleton className="flex flex-col bg-muted/20 items-center rounded-xl gap-2 max-w-sm w-full py-6 mt-4">
        <Skeleton className="w-24 h-4 bg-muted/20 rounded-md" />
        <Skeleton className="w-40 h-5 bg-muted/20 rounded-md" />
        <Skeleton className="w-32 h-8 bg-muted/30 rounded-md" />
      </Skeleton>
      <Skeleton className="absolute top-4 right-4 w-20 h-8 bg-muted/20 rounded-md" />
    </div>
  );
};

export default ProfileSkeleton;
