import { useLayout } from "@/lib/hooks/useLayout";

export const Logo = () => {
  const { sideNavCollapsed: isCollapsed } = useLayout();

  return (
    <div className="flex items-center justify-center h-[110px] mt-4 mb-4">
      {!isCollapsed && (
        <h1 className="text-4xl font-semibold text-white leading-none">
          <span className="text-7xl font-bold text-primary align-middle">
            G
          </span>
          yaan
          <span className="text-primary font-semibold">Hub</span>
        </h1>
      )}

      {isCollapsed && (
        <span className="text-7xl font-bold text-primary">
          G
        </span>
      )}
    </div>
  );
};
