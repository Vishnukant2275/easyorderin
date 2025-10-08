import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserFooter from "../pages/UserFooter";
import UserHeader from "../pages/UserHeader";
import "./User.css";

const User = () => {
  const location = useLocation();

  // Hide footer on login/signup pages
  const showFooter = ![
    "/login",
    "/signup",
    "/user/login",
    "/user/signup",
  ].includes(location.pathname);

  return (
    <div className="user-layout">
      <UserHeader />
      <main className="user-main">
        <Outlet />
      </main>
      {showFooter && <UserFooter />}
    </div>
  );
};

export default User;
