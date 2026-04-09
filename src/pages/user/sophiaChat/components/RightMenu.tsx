import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WordLimiter from "./chatSettings/WordLimiter";
import { FileText, MessageCirclePlus } from "lucide-react";
import { BsTextareaT } from "react-icons/bs";
import { AiFillControl } from "react-icons/ai";
import VaultModal from "./chatSettings/VaultModal";
import ModeSelectionModal from "./chatSettings/ChatModeSelector";
import { useChatStore } from "@/store";
const RightMenu = ({ personalityId }) => {
  const [toggle, setToggle] = useState(false);
  const toggleRef = useRef(null);
  const [wordLimitModalOpen, setWordLimitModalOpen] = useState(false);
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [modeSelectionModalOpen, setModeSelectionModalOpen] = useState(false);
  const navigate = useNavigate();
  const { wordLimit, chatMode } = useChatStore();

  const handleClickOutside = (event) => {
    if (toggleRef.current && !toggleRef.current.contains(event.target)) {
      setToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNewChat = () => {
    navigate(
      personalityId ? `/chat/${personalityId}?new=true` : `/chat?new=true`
    );
  };

  return (
    <>
      <div className="flex gap-2 absolute top-2 right-2 xl:right-0 w-fit">
        <WordLimiter
          wordLimitModalOpen={wordLimitModalOpen}
          setWordLimitModalOpen={setWordLimitModalOpen}
        />
      

       
        <Button
          onClick={handleNewChat}
          className="gap-1 relative z-[5] p-2 md:p-4"
        >
          <MessageCirclePlus />
          <p className="hidden sm:block">New Class</p>
        </Button>

       
      </div>
    </>
  );
};

export default RightMenu;
