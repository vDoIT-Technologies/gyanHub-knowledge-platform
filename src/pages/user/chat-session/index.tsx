import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery } from "react-query";
import { useUserStore } from "@/store";
import ChatSessionCard from "./components/ChatSessionCard";
import TableLoader from "@/components/loaders/TableLoader";
import { Scrollbars } from "react-custom-scrollbars-2";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounceCallback } from "usehooks-ts";
import { apiFetchChatSession } from "@/services/chat.api"; 
import DataNotFound from '@/assets/images/nodata.png'
const SortOptions = [
  { label: "Created At (Desc)", value: "desc" },
  { label: "Created At (Asc)", value: "asc" },
];

const ItemsPerPageOptions = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

const ChatSession = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [tableData, setTableData] = useState({
    pageIndex: 1,
    pageSize: 10,
    sort: SortOptions[0].value,
    search: "",
  });

  const [totalPages, setTotalPages] = useState(1);
  const { user } = useUserStore();

  const { data, isLoading, isError, error } = useQuery(
    ["chatSessions", tableData],
    () =>
      apiFetchChatSession({
        userId: user.userId||user.id,
        pageIndex: tableData.pageIndex,
        pageSize: tableData.pageSize,
        sort: tableData.sort,
        search: tableData.search,
      }),
    {
      onSuccess: (response) => {
        const { sessions=[], tableData } = response.data.data;
        setTotalPages(tableData?.totalPages);
        setSessions(sessions); 
      },
      enabled: Boolean(user.userId || user.id),
    }
  );

  const [sessions, setSessions] = useState([]);

  const handleDropdownToggle = (index) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const onSort = (sort) => {
    setTableData((prev) => ({
      ...prev,
      sort,
      pageIndex: 1,
    }));
  };

  const debounceFn = useDebounceCallback((value) => {
    setTableData((prev) => ({
      ...prev,
      search: value,
      pageIndex: 1,
    }));
  }, 1000);

  const handleSearch = (e) => {
    debounceFn(e.target.value);
  };

  const handlePageChange = (pageIndex) => {
    if (pageIndex > 0 && pageIndex <= totalPages) {
      setTableData((prev) => ({
        ...prev,
        pageIndex,
      }));
    }
  };

  return (
    <>
    <h2 className="mb-5">Chat History</h2>
    <Card className="bg-[#FFFFFF0D] shadow-md w-full max-w-full mx-auto border-none rounded-xl mt-2">
      <div className="py-4 sm:py-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 justify-between px-4 sm:px-6">
        <Input
          placeholder="Search..."
          className="w-full sm:w-1/2 px-2 py-5 rounded-lg bg-white/10 text-white focus:outline-none"
          onChange={handleSearch}
        />
        <Select
          onValueChange={(value) =>
            onSort(SortOptions.find((option) => option.label === value)?.value)
          }
          defaultValue={
            SortOptions.find((option) => option.value === tableData.sort)?.label
          }
        >
          <SelectTrigger className="w-full sm:w-[170px] py-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              {SortOptions.map((option, index) => (
                <SelectItem key={index} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isLoading ||sessions?.length === 0 ? (
        <TableLoader />
      ) : isError ? (
        <div className="flex flex-col items-center gap-6 py-12 px-6">
          <div className="w-3/4 max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
            <img
              src={DataNotFound}
              alt="No data found"
              className="w-full h-auto rounded-md opacity-90"
            />
          </div>
          <p className="text-center text-white text-lg md:text-xl mt-4 opacity-90">
            No data available.
          </p>
        </div>
      ) : (
        <div className="space-y-3 py-3">
          <Scrollbars style={{ height: "60vh" }} autoHide>
            <div className="space-y-2">
              {sessions.map((session, index) => (
                <ChatSessionCard
                  key={session.id}
                  session={session}
                  onDropdownToggle={() => handleDropdownToggle(index)}
                  isDropdownOpen={openDropdownIndex === index}
                />
              ))}
            </div>
          </Scrollbars>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 py-4 px-2 sm:px-0">
            <Pagination className="flex justify-end">
              <PaginationPrevious
                onClick={() => handlePageChange(tableData.pageIndex - 1)}
                aria-disabled={tableData.pageIndex === 1}
                className={
                  tableData.pageIndex === 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                Previous
              </PaginationPrevious>
              <PaginationContent >
                <PaginationItem>
                  <PaginationLink>{tableData.pageIndex}</PaginationLink>
                </PaginationItem>
              </PaginationContent>
              <PaginationNext
                onClick={() => handlePageChange(tableData.pageIndex + 1)}
                aria-disabled={tableData.pageIndex >= totalPages}
                className={
                  tableData.pageIndex >= totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                Next
              </PaginationNext>
            </Pagination>

            <Select
              onValueChange={(value) =>
                setTableData((prev) => ({
                  ...prev,
                  pageSize: parseInt(value, 10),
                  pageIndex: 1,
                }))
              }
              defaultValue={String(tableData.pageSize)}
            >
              <SelectTrigger className="w-full sm:w-[150px] py-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
                <SelectGroup>
                  <SelectLabel>Per Page</SelectLabel>
                  {ItemsPerPageOptions.map((option, index) => (
                    <SelectItem key={index} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </Card></>
    
  );
};

export default ChatSession;
