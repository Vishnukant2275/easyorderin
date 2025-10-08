import { Routes, Route } from "react-router-dom";
import UserLogin from "../pages/UserLogin";
import UserSignUp from "../pages/UserSignUp";
import UserMenu from "../pages/UserMenu";
import User from "../layouts/User";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<User />}>
        {/* Default route when accessing / */}
        <Route index element={<UserMenu />} />

        {/* Nested routes under / */}
        <Route path="menu" element={<UserMenu />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="signup" element={<UserSignUp />} />

        {/* Add other routes */}
        <Route
          path="cart"
          element={<div className="mobile-page">Cart Page</div>}
        />
        <Route
          path="orders"
          element={<div className="mobile-page">Orders Page</div>}
        />
        <Route
          path="account"
          element={<div className="mobile-page">Account Page</div>}
        />
      </Route>
    </Routes>
  );
};

export default UserRouter;
