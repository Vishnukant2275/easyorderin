import React from "react";
import RestaurantSidebar from "../../components/RestaurantSidebar";
import StatusCards from "../../components/StatusCards";
import RevenueChart from "../../components/RevenueChart";
import RecentOrders from "../../components/RecentOrders";
import PopularMenu from "../../components/PopularMenu";
import StaffOverview from "../../components/StaffOverview";

const RestaurantDashbord = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}

      {/* Main content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <h2 className="mb-4">Restaurant Dashboard</h2>

        {/* Row 1: Status cards */}
        <StatusCards />

        {/* Row 2: Chart + Orders */}
        <div className="row mt-4"></div>
        {/* Row 3: Popular Menu + Staff */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <RecentOrders />
          </div>
          <div className="col-md-6 mb-4">
            <PopularMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashbord;
