import { useLayout } from "@/lib/hooks/useLayout";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export const NavToggle = () => {
  const { toggleNav, sideNavCollapsed: isCollapsed } = useLayout();
  return (
    <span
      onClick={toggleNav}
      role="button"
      className="p-1 border border-gray-800 z-40 rounded-full bg-secondary absolute top-[28px] -right-2.5 flex items-center justify-center text-white"
    >
      {isCollapsed ? (
        <FaAngleRight size={18} className="text-sm font-semibold text-white" />
      ) : (
        <FaAngleLeft size={18} className="text-sm font-semibold text-white" />
      )}
    </span>
  );
};
