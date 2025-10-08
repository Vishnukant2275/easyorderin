import React from "react";

import { Outlet } from "react-router-dom";
import RestaurantSidebar from "../components/RestaurantSidebar";

const RestaurantDashboard = () => {
  return (
     <div className="d-flex">
      <RestaurantSidebar />
      <Outlet />
    </div>
  );
};

export default RestaurantDashboard;
