import { Navigate, useLocation } from "react-router-dom";
import { APP_CONFIG } from "@/constants/app-config";
import UserLayout from "./UserLayout";
import { useUserStore } from "@/store";
import { useAppConfig } from "./AppConfigProvider";
import PageLoader from "../loaders/PageLoader";
const { unAuthenticatedEntryPath } = APP_CONFIG;

export const ProtectedRoute = () => {
  const { isAuthenticated } = useUserStore();
  const { isLoading } = useAppConfig();
  const location = useLocation();
  if (isLoading) {
    return <PageLoader />;
  }
  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to={unAuthenticatedEntryPath}
        state={{ from: location }}
      />
    );
  }

  return <UserLayout />;
};
