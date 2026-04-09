import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

export const PersonalityListLoader = () => {
  return (
    <Card className="relative mx-2 flex flex-col justify-center items-center gap-6 p-6 h-[380px] bg-[#FFFFFF0D] rounded-xl shadow-lg overflow-hidden">
      <Skeleton className="absolute h-full w-full bg-muted/10 pb-20" />
      <div className="bg-muted/10 backdrop-blur-sm absolute top-4 left-6  flex justify-center items-center px-2 py-1 gap-2 shadow-lg rounded-full">
        <Skeleton className="w-3 h-3 bg-muted/30 rounded-full" />
        <Skeleton className="w-12 h-3 bg-muted/30" />
      </div>
      <div className="flex flex-col items-center text-center gap-4 justify-end h-full w-full">
        <Skeleton className="w-32 h-6 bg-muted/30" />
        <Skeleton className="w-full h-4 bg-muted/30" />
        <Skeleton className="w-full h-10 bg-muted/30" />
      </div>
    </Card>
  );
};
