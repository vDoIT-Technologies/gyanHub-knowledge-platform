import { useEffect } from "react";
import { ProtectedRouteInterface } from "@/configs/routes/protected-routes";
import { APP_CONFIG } from "@/constants/app-config";
const AppRoute = ({ ...props }: ProtectedRouteInterface) => {
  const { component: Component, name } = props;
  const isAuthenticated = true;

  useEffect(() => {
    if (isAuthenticated) {
      const title = name
        ? name + ` | ${APP_CONFIG.appName}`
        : APP_CONFIG.appName;
      document.title = title;
    } else {
      const title = name
        ? name + ` | ${APP_CONFIG.appName}`
        : APP_CONFIG.appName;
      document.title = title;
    }
  }, [isAuthenticated, name]);

  return <Component />;
};

export default AppRoute;
