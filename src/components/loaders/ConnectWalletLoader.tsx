import React from "react";
import { Skeleton } from "../ui/skeleton";

const ConnectWalletLoader = () => {
  return (
    <Skeleton className="flex flex-col relative gap-4 justify-start items-center min-h-[80vh] bg-muted/10 mt-4 px-4 overflow-hidden p-4">
      <Skeleton className="flex justify-center items-center w-full h-16 bg-muted/20">
        <Skeleton className="flex justify-center items-center w-1/5 h-6 bg-muted/30" />
      </Skeleton>
      <div className="flex flex-col md:flex-row gap-4 w-full  md:h-[20rem]">
        <Skeleton className="bg-muted/20 border-none rounded-2xl shadow-lg relative flex flex-col gap-4 md:gap-8 justify-center items-center w-full h-full overflow-hidden p-4 py-8">
          <Skeleton className="flex justify-center items-center gap-4 md:gap-10 bg-muted/10 p-4 px-6">
            <Skeleton className="w-20 h-20 rounded-full bg-muted/30" />
            <div className="space-y-3">
              <Skeleton className="w-24 h-3 rounded-md bg-muted/30" />
              <Skeleton className="w-28 h-6 rounded-md bg-muted/30" />
            </div>
          </Skeleton>
          <div className="w-full flex flex-col gap-2 items-center">
            <Skeleton className="w-1/5 h-3 bg-muted/30" />
            <Skeleton className="w-2/5 h-5 bg-muted/30" />
          </div>
        </Skeleton>
        <div className="flex flex-col gap-4 w-full h-full">
          <Skeleton className="flex justify-center items-center flex-col gap-2 h-full bg-muted/20 rounded-2xl py-4">
            <Skeleton className="flex justify-center items-center w-1/5 h-3 bg-muted/30" />
            <Skeleton className="flex justify-center items-center w-2/5 h-6 bg-muted/30" />
          </Skeleton>
          <Skeleton className="flex justify-center items-center gap-4 h-full bg-muted/20 rounded-2xl py-6">
            <Skeleton className="flex justify-center items-center w-1/5 h-5 bg-muted/30" />
          </Skeleton>
        </div>
      </div>
    </Skeleton>
  );
};

export default ConnectWalletLoader;
