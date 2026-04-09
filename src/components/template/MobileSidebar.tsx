import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scrollbars } from "react-custom-scrollbars-2";
import { X } from "lucide-react";
import { navIcons } from "@/configs/nav-configs/nav-icons-config";
import { navItems } from "@/configs/nav-configs/nav-items-config";
const menuVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
  closed: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export const MobileSidebar = ({ isOpen, toggleMenu }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="fixed top-0 left-0 z-50 h-full w-[280px] max-w-[80vw] md:hidden rounded-r-2xl backdrop-blur-xl bg-slate-900/90 text-white border-r border-white/10 shadow-2xl"
      >
        <Button
          size="icon"
          onClick={toggleMenu}
          variant="ghost"
          className="absolute top-4 right-4 rounded-full text-white/70 hover:text-white hover:bg-white/10 z-50"
        >
          <X size={20} />
        </Button>
        <div className="py-6 px-8 flex items-center gap-3">
          <img src="/img/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg" />
          <span className="font-bold text-xl tracking-tight">GyanHub</span>
        </div>
      <div
        className="w-full border-t border-solid border-1"
        style={{
          borderImageSource:
            "linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)",
          borderImageSlice: 4,
        }}
      ></div>
      <Scrollbars hideTracksWhenNotNeeded autoHide>
        <motion.ul className="flex flex-col py-6 px-10 gap-6 mt-2">
          {navItems.map((item) => (
            <motion.li
              onClick={toggleMenu}
              key={item.key}
              className={`flex items-center gap-4 rounded-md px-4 py-1  text-4xl hover:bg-primary hover:bg-opacity-20 transition-colors duration-200 ease-in-out ${
                window.location.pathname === item.path
                  ? "bg-primary rounded-md px-4 py-1 bg-opacity-20 "
                  : ""
              }`}
            >
              {navIcons[item.key]}
              <Link to={item.path} className="text-lg">
                {item.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </Scrollbars>
    </motion.div>
    </>
  );
};
