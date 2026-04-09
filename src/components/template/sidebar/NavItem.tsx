import { NavLink } from "react-router-dom";
import { useLayout } from "@/lib/hooks/useLayout";
import { navIcons } from "../../../configs/nav-configs/nav-icons-config";

export const NavItem = ({ item }) => {
  const { sideNavCollapsed: isCollapsed } = useLayout();

  const itemClasses = `h-[40px] group my-auto relative ${
    isCollapsed ? "flex items-center justify-center w-[40px]" : ""
  }`;

  const linkClasses = ({ isActive }) => {
    return `flex items-center transition-all rounded-md h-full w-full ${
      isCollapsed ? "justify-center" : "gap-2 ps-3"
    } ${
      isActive
        ? "bg-black/50 text-gray-100"
        : "hover:bg-black/50 hover:text-gray-100"
    }`;
  };

  const tooltipClasses = `absolute left-full z-50 bg-indigo-100 text-indigo-800 rounded-md px-2 font-medium text-sm ml-6 py-1 invisible opacity-20 -translate-x-2 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
              `;

  return (
    <li className={itemClasses}>
      <NavLink to={item.path} className={linkClasses}>
        <span className="text-2xl">{navIcons[item.key]}</span>
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </NavLink>
      {isCollapsed && <span className={tooltipClasses}>{item.label}</span>}
    </li>
  );
};
