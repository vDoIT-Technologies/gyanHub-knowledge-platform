import Scrollbars from "react-custom-scrollbars-2";
import { navItems } from "../../../configs/nav-configs/nav-items-config";
import { useLayout } from "@/lib/hooks/useLayout";
import { Logo } from "@/components/shared/Logo";
import { NavBottom } from "./NavButtom";
import { NavItem } from "./NavItem";
import { NavToggle } from "./NavToggle";

export const SideNav = () => {
  const { sideNavCollapsed: isCollapsed } = useLayout();

  return (
    <aside
      className={` ${
        isCollapsed
          ? "px-3 w-[80px] h-[98vh] sticky top-0 left-0 "
          : "w-[300px] px-4 h-[98vh] sticky top-0 left-0"
      } relative transition-all border-r shadow-md flex flex-col pb-1 bg-sophia-gradient z-50  rounded-xl`}
    >
      <NavToggle />
      <Logo />
      <div
        className="w-full border-t border-solid"
        style={{
          borderImageSource:
            "linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)",
          borderImageSlice: 1,
        }}
      ></div>
      <nav className="flex flex-col justify-between flex-1 gap-2 mt-6">
        {renderNavItems(isCollapsed)}
        <NavBottom />
      </nav>
    </aside>
  );
};

const renderNavItems = (isCollapsed) => {
  const navList = (
    <ul className={`space-y-3 ${isCollapsed ? "" : "overflow-x-hidden"}`}>
      {navItems.map((item) => (
        <NavItem key={item.key} item={item} />
      ))}
    </ul>
  );

  return isCollapsed ? (
    navList
  ) : (
    <Scrollbars autoHide hideTracksWhenNotNeeded>
      {navList}
    </Scrollbars>
  );
};
