import { ClipboardCheck, PenLine} from "lucide-react";
import { MdVideoChat } from "react-icons/md";
import {
  BiSolidUser,
  BiSolidMessageDots,
  BiSolidBarChartSquare,
} from "react-icons/bi";
import { FaChartPie, FaClock, FaUsers ,FaDatabase} from "react-icons/fa";

export const navIcons = {
  chat: <BiSolidMessageDots />,
  aiAssistants: <FaUsers />, 
  avatarChat:<MdVideoChat />,
  history: <FaDatabase />,
  analytics: <BiSolidBarChartSquare />,
  setting: <FaChartPie />,
  profile: <BiSolidUser />,
  quiz: <ClipboardCheck />,
  content: <PenLine />
};
