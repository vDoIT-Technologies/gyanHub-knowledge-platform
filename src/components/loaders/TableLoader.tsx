import { Skeleton } from "../ui/skeleton";

const TableLoader = () => {
  const chatLoaders = Array.from({ length: 5 }).map((_, index) => (
    <Skeleton
      key={index}
      className="flex flex-row justify-between gap-8 bg-[#11151E] p-4 w-full rounded-md h-20"
    >
      <Skeleton className="flex flex-col gap-2 bg-muted/20 max-w-xs sm:max-w-2xl w-full h-8" />
      <Skeleton className=" w-10 sm:w-44 h-8 bg-muted/20" />
    </Skeleton>
  ));

  return (
    <Skeleton className="flex flex-col justify-between gap-4 px-4 py-2 w-full h-[70vh] bg-muted/10 overflow-hidden">
      <div className="flex flex-col">
        <div className="flex justify-between pb-6">
          <Skeleton className="flex flex-col gap-2 bg-[#11151E] p-4 max-w-xs xl:max-w-lg w-full h-16 rounded-md">
            <Skeleton className="w-full max-w-xs h-3 bg-muted/20" />
            <Skeleton className="w-44 h-3 bg-muted/20" />
          </Skeleton>
          <Skeleton className="hidden xl:flex flex-col gap-2 bg-[#11151E] p-4 w-36 h-14 rounded-md">
            <Skeleton className="self-end w-14 h-3 bg-muted/20" />
          </Skeleton>
        </div>
        <div className="flex flex-col gap-4 ">{chatLoaders}</div>
      </div>
      <Skeleton className="flex flex-col gap-2 bg-[#11151E] p-4 w-full h-14 rounded-md">
        <Skeleton className="self-end w-32 h-3 bg-muted/20" />
      </Skeleton>
    </Skeleton>
  );
};

export default TableLoader;
