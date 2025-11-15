import { Routes, Route } from "react-router-dom";

import UserSignUp from "../pages/Users/UserSignUp";
import UserMenu from "../pages/Users/UserMenu";
import User from "../layouts/User";

import UserOrders from "../pages/Users/UserOrders";
import UserAccount from "../pages/Users/UserAccount";
import UserCart from "../components/UserCart/UserCart";
import PageNotFound from "../pages/PageNotFound";
const UserRouter = () => {
  return (
    <Routes>
      <Route path="/restaurant" element={<UserMenu />} />
      <Route path="/" element={<User />}>
        {/* Default route when accessing / */}
        <Route index element={<UserMenu />} />

        {/* Nested routes under / */}
        <Route path="getMenu" element={<UserMenu />} />
      
        <Route path="signup" element={<UserSignUp />} />
        <Route path="cart" element={<UserCart />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="account" element={<UserAccount />} />

        <Route
          path="*"
          element={
            <PageNotFound homeUrl="/" buttonText="Explore our service" />
          }
        />
      </Route>
    </Routes>
  );
};

export default UserRouter;
