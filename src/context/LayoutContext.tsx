import { createContext, useState, ReactNode } from "react";

export interface LayoutContextType {
  sideNavCollapsed: boolean;
  mobileMenuOpen: boolean;
  toggleNav: () => void;
  toggleMobileMenu: () => void;
}
const defaultLayoutContext: LayoutContextType = {
  sideNavCollapsed: false,
  mobileMenuOpen: false,
  toggleNav: () => {},
  toggleMobileMenu: () => {},
};

const LayoutContext = createContext<LayoutContextType>(defaultLayoutContext);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleNav = () => {
    setSideNavCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <LayoutContext.Provider
      value={{ toggleNav, sideNavCollapsed, toggleMobileMenu, mobileMenuOpen }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
