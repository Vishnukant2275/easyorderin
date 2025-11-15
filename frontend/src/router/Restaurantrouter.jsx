import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

const RestoSignUp = React.lazy(() => import("../pages/Restaurant/RestoSignUp"));
import RestoLogIn from "../pages/Restaurant/RestoLogIn";
import PageNotFound from "../pages/PageNotFound";

const Restaurantrouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="login" element={<RestoLogIn />} />
        <Route path="signup" element={<RestoSignUp />} />
        <Route
          path="*"
          element={
            <PageNotFound
              homeUrl="/restaurant/login"
              buttonText="Go to login page"
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default Restaurantrouter;
