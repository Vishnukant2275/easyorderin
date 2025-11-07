import { Routes, Route } from "react-router-dom";
import UserLogin from "../pages/UserLogin";
import UserSignUp from "../pages/UserSignUp";
import UserMenu from "../pages/UserMenu";
import User from "../layouts/User";

import UserOrders from "../pages/UserOrders";
import UserAccount from "../pages/UserAccount";
import UserCart from "../components/UserCart/UserCart";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<User />}>
        {/* Default route when accessing / */}
        <Route index element={<UserMenu />} />

        {/* Nested routes under / */}
        <Route path="getMenu" element={<UserMenu />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="signup" element={<UserSignUp />} />
        <Route path="cart" element={<UserCart />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="account" element={<UserAccount />} />
      </Route>
    </Routes>
  );
};

export default UserRouter;
