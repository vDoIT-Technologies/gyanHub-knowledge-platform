import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoute from "@/components/layouts/AppRoute";
import PageLoader from "@/components/loaders/PageLoader";
import { ProtectedRoute } from "../components/layouts/ProtectedRoute";
import { PublicRoute } from "../components/layouts/PublicRoute";
import protectedRoutes from "../configs/routes/protected-routes";
import publicRoutes from "../configs/routes/public-routes";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        {protectedRoutes?.map(({ key, ...route }) => (
         // @ts-ignore
          <Route
            key={route.name}
            path={route.path}
            Component={() => <AppRoute key={key} {...route} />}
          />
        ))}
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes?.map(({ key, ...route }) => (
          <Route
            key={route.name}
            path={route.path}
            Component={() => <AppRoute key={key} {...route} />}
          />
        ))}
      </Route>
    </Routes>
  );
};

const Pages = () => {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <AllRoutes />
      </Suspense>
    </>
  );
};

export default Pages;
