import { Suspense } from "react";
import AuthSectionImage from "../shared/AuthSectionImage";
import { Footer } from "../template/Footer";
import { Outlet } from "react-router-dom";
import BgGradient from "../template/BgGradient";
import AuthLogo from "../shared/AuthLogo";
import PageLoader from "../template/PageLoader";

const AuthLayout = () => {
  return (
    <Suspense>
      <div className="flex flex-col relative justify-center items-center min-h-screen py-8 overflow-y-auto bg-slate-950">
        <main className="flex flex-col items-center justify-center w-full max-w-7xl px-4 lg:gap-12 pb-12">
          <AuthLogo />
          <div className="bg-stone-700/15 z-50 relative mt-8 py-8 px-4 sm:px-6 lg:py-16 flex flex-col lg:flex-row items-center justify-center lg:gap-12 xl:gap-24 rounded-3xl shadow-lg w-full max-w-[1000px]">
            <div className="w-full">
              <AuthSectionImage />
            </div>
            <div className="flex justify-center lg:justify-start w-full">
              <div className="w-full max-w-sm">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <BgGradient />
      </div>
    </Suspense>
  );
};
export default AuthLayout;
