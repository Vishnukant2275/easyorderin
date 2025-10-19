import React from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import UserFooter from "../pages/UserFooter";
import UserHeader from "../pages/UserHeader";
import { CartProvider } from "../context/CartContext"; // Import the CartProvider
import styles from "./UserLayout.module.css";

const User = () => {
  const location = useLocation();
  const { restaurantID, tableNumber } = useParams();

  // Hide footer on login/signup pages
  const showFooter = ![
    "/login",
    "/signup",
    "/user/login",
    "/user/signup",
  ].includes(location.pathname);

  return (
    <CartProvider restaurantID={restaurantID} tableNumber={tableNumber}>
      <div className={styles.userLayout}>
        <UserHeader />
        <div className="main-content">
          <main className="user-main">
            <Outlet />
          </main>
        </div>
        {showFooter && <UserFooter />}
      </div>
    </CartProvider>
  );
};

export default User;