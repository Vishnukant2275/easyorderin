import { Routes, Route } from "react-router-dom";


import UserLogin from "../pages/UserLogin";
import UserSignUp from "../pages/UserSignUp";

import React from "react";
const UserRouter = () => {
  return (
    <Routes>
      <Route path="login" element={<UserLogin />} />
      <Route path="signup" element={<UserSignUp />} />
    </Routes>
  );
};

export default UserRouter;
