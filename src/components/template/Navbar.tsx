import { Link } from "react-router-dom";
import { PATHS } from "../../constants/page-paths";
import { ProfileDropdown } from "./ProfileDropdown";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlignLeft } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="h-16  flex items-center  z-10 fixed top-0 right-0 w-full">
      <div className="flex items-center justify-between w-full h-full px-4 sm:px-6 md:px-5 backdrop-blur-3xl">
        <div className="flex items-center h-full">
          <Button
            size="icon"
            onClick={toggleMenu}
            className="md:hidden bg-transparent text-white"
          >
            <AlignLeft size={20} />
          </Button>
          <Link to={PATHS.HOME}>
            <img
              src="/img/SentienceLogo.svg"
              className="w-7 mt-2 block md:hidden"
              alt="Sentience Logo"
            />
          </Link>
        </div>

        <div className="flex items-center gap-6 h-full">
          <ProfileDropdown />
        </div>
      </div>
      <MobileSidebar isOpen={isOpen} toggleMenu={toggleMenu} />
    </nav>
  );
};

export default Navbar;
