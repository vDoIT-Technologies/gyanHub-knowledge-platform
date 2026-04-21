import { Link } from "react-router-dom";
import { PATHS } from "../../constants/page-paths";
import { ProfileDropdown } from "./ProfileDropdown";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlignLeft } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 right-0 z-10 flex h-16 w-full items-center border-b border-border/50 bg-background/70">
      <div className="flex h-full w-full items-center justify-between px-4 backdrop-blur-3xl sm:px-6 md:px-5">
        <div className="flex items-center h-full">
          <Button
            size="icon"
            onClick={toggleMenu}
            className="bg-transparent text-foreground md:hidden"
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

        <div className="flex h-full items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>
      <MobileSidebar isOpen={isOpen} toggleMenu={toggleMenu} />
    </nav>
  );
};

export default Navbar;
