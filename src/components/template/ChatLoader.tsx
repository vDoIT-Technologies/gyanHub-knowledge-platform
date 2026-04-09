import { Skeleton } from "../ui/skeleton";

const ChatLoader = () => {
  return (
    <Skeleton className="flex flex-col gap-2 bg-[#11151E] p-4 max-w-xl w-full rounded-3xl rounded-tl-none">
      <Skeleton className="w-full max-w-xs h-3 bg-muted/20" />
      <Skeleton className="w-full max-w-md h-3 bg-muted/20" />
    </Skeleton>
  );
};

export default ChatLoader;
