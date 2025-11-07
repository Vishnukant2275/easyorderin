// src/pages/RestaurantDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import RestaurantSidebar from "../components/RestaurantSidebar";
import ProtectedRoute from "../hooks/ProtectectedRoute";

const RestaurantDashboard = () => {
  return (
    <ProtectedRoute>
      <div className="d-flex">
        <RestaurantSidebar />
        <div className="flex-grow-1 p-3">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RestaurantDashboard;
