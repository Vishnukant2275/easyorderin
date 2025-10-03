import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

const RestoSignUp = React.lazy(() => import("../pages/RestoSignUp"));
import RestoLogIn from "../pages/RestoLogIn";

const Restaurantrouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="login" element={<RestoLogIn />} />
        <Route path="signup" element={<RestoSignUp />} />
        
      </Routes>
    </Suspense>
  );
};

export default Restaurantrouter;
