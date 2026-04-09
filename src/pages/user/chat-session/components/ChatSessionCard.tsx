import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format as formatDate, isToday, isYesterday } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatSessionModal from "./ChatSessionModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/store";
const ChatSessionCard = ({ session, onDropdownToggle, isDropdownOpen }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    onDropdownToggle(false);
  };
  const handleEditClick = () => {
    setEditModalOpen(true);
    onDropdownToggle(false);
  };

  function format(dateString) {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${formatDate(date, "HH:mm")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${formatDate(date, "HH:mm")}`;
    }
    return formatDate(date, "dd:MM:yyyy 'at' HH:mm");
  }

  const handleContinue = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);

    navigate(`/chat/${session?.personality?.id}/${session.id}`);
  };

  return (
    <>
      <div className="block lg:hidden">
        {isDropdownOpen && (
          <div className="absolute right-10 mt-2 bg-secondary text-white rounded-lg shadow-xl p-4 flex flex-col items-stretch w-48">
            <Button
              variant="ghost"
              size="sm"
              className="bg-secondary text-white hover:bg-secondary/80 rounded-t-lg py-2 mb-1 transition-all duration-200"
              onClick={() =>
                navigate(`/chat/${session?.personality?.id}/${session.id}`)
              }
            >
              Continue
            </Button>
            <div className="h-px bg-gray-300 w-full mb-1"></div>{" "}
            {/* Horizontal line separator */}
            <Button
              variant="ghost"
              size="sm"
              className="bg-secondary text-white hover:bg-secondary/80 py-2 mb-1 transition-all duration-200"
              onClick={handleEditClick}
            >
              Edit
            </Button>
            <div className="h-px bg-gray-300 w-full mb-1"></div>{" "}
            {/* Horizontal line separator */}
            <Button
              variant="ghost"
              size="sm"
              className="bg-secondary text-white hover:bg-secondary/80 rounded-b-lg py-2 transition-all duration-200"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <Card className="bg-[#00000033] hover:bg-black/10 transition mx-6 border-none">
        <div className="flex items-center space-x-1 px-4">
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={`/img/teachers.png`}
              alt="Assistant img"
            />
            <AvatarFallback>
              {session.title ? session.title.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>

          {/* Content Section */}
          <div className="flex-1 max-w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-white break-words max-w-[12rem] sm:max-w-[20rem] lg:max-w-96 line-clamp-1">
                {session.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                <span className="font-medium text-primary">Started on:</span>{" "}
                {format(session.createdAt)} |
                <span className="font-medium text-primary"> Last Update:</span>{" "}
                {format(session.updatedAt)}
              </CardDescription>
            </CardHeader>
          </div>

          {/* Actions Section */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
              <LuTrash2 className="w-5 h-5 text-white " />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleEditClick}>
              <LuPencil className="w-5 h-5 text-white " />
            </Button>
            <Button
              className="bg-primary text-white rounded-lg px-4 py-2"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>

          <div className="block lg:hidden">
            <EllipsisVertical onClick={onDropdownToggle} />
          </div>
        </div>
      </Card>

      <ChatSessionModal
        session={session}
        isDeleteModalOpen={isDeleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        isEditModalOpen={isEditModalOpen}
        setEditModalOpen={setEditModalOpen}
        onDropdownToggle={onDropdownToggle}
      />
    </>
  );
};

export default ChatSessionCard;
