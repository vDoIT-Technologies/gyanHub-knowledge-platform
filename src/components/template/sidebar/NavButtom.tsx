import { useLayout } from "@/lib/hooks/useLayout";
import { useAuth } from "@/lib/hooks/useAuth";
import { FaPowerOff } from "react-icons/fa";
import { useState } from "react";
import LogoutModal from "../LogoutModal";
export const NavBottom = () => {
  const { sideNavCollapsed: isCollapsed } = useLayout();

  const[logoutModalOpen,setLogoutModalOpen]=useState(false)

  return (
    <>
    <LogoutModal logoutModalOpen={logoutModalOpen} setLogoutModalOpen={setLogoutModalOpen} />
    <div
      className={`h-[44px] flex items-center gap-2 cursor-pointer hover:bg-black/50 hover:text-gray-100" rounded-md
    ${isCollapsed ? "justify-center" : "ps-3"}
    `}
      onClick={()=>setLogoutModalOpen(true)}
    >
      <FaPowerOff className="text-2xl" />
      {!isCollapsed && <span className="font-medium">Log out</span>}
      
    </div>
    </>
   
  );
};
