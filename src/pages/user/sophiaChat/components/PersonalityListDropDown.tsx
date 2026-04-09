import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import Scrollbars from 'react-custom-scrollbars-2'
export const PersonalityListDropDown = ({
  isLoading,
  assistants,
  onSelectPersonality,
  selectedId,
}) => {
  return (
    <div>
      <DropdownMenu>
        {isLoading ? (
          <Skeleton className="absolute bottom-2 right-0 md:right-5 lg:right-1 z-[5] px-2 bg-gray-900 backdrop-blur-md border cursor-pointer w-12 h-12 lg:w-44 lg:h-12 rounded-full lg:rounded-lg shadow-lg" />
        ) : (
          <DropdownMenuTrigger className="absolute bottom-2 right-0 md:right-5 lg:right-1 z-[5] flex justify-between items-center gap-2 px-2 bg-gray-900/50 backdrop-blur-md border border-white/10 cursor-pointer w-12 h-12 lg:w-44 lg:h-12 rounded-full lg:rounded-lg shadow-lg">
            <div className="flex justify-center items-center gap-2">
              <img
                src={`data:image/jpeg;base64,${assistants.find((a) => a.id === selectedId)?.avatarImg}`}
                alt={assistants.find((a) => a.id === selectedId)?.name}
                className="w-8 h-8 rounded-full"
              />
              <p className="hidden lg:block text-sm truncate max-w-20 md:max-w-36">
                {assistants.find((a) => a.id === selectedId)?.name || "Sophia"}
              </p>
            </div>
            <ChevronDown className="hidden lg:block" />
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent className="bg-gray-800/50 mr-10 backdrop-blur-md border-gray-500 p-2">
        
        <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={180} >
          {isLoading ? (
            <Skeleton className="w-full h-8 rounded-full bg-gray-800" />
          ) : (

            assistants.map((assistant) => (
              <DropdownMenuItem
                key={assistant.id}
                onClick={() => onSelectPersonality(assistant.id)}
                className={`flex justify-between space-x-10 sm:gap-4 px-2  mr-3 cursor-pointer hover:bg-gray-700 ${
                  selectedId === assistant.id ? "bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center text-xs sm:text-sm">
                  <img
                    src={`data:image/jpeg;base64,${assistant.avatarImg}`}
                    alt={assistant.name}
                    className="w-8 h-8 rounded-full mr-2 "
                  />
                 <span className="truncate max-w-20 md:max-w-36">{assistant.name}</span> 
                </div>
                {selectedId === assistant.id && (
                  <p className="text-green-400 text-[10px] sm:text-xs">
                    Selected
                  </p>
                )}
              </DropdownMenuItem>
            ))
          )}
          </Scrollbars>
       
       
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
