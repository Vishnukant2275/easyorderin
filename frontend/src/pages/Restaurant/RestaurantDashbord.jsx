import React, { useState, useEffect } from "react";
import StatusCards from "../../components/StatusCards";
import RecentOrders from "../../components/RecentOrders";
import PopularMenu from "../../components/PopularMenu";
import NotActive from "../../components/NotActive";

const RestaurantDashboard = () => {
  const [showInactiveAlert, setShowInactiveAlert] = useState(false);
  const [inactiveMessage, setInactiveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check restaurant status live from API
  const checkRestaurantStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(" /restaurant/check-status", {
        method: "GET",
        credentials: "include", // Important for session
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          if (data.status !== "active") {
            setShowInactiveAlert(true);
            setInactiveMessage(
              data.message ||
                "This restaurant is currently inactive. Please contact support to activate your account."
            );
          } else {
            setShowInactiveAlert(false);
            // Clear any stored inactive messages if restaurant is now active
            localStorage.removeItem("inactiveRestaurantMessage");
          }
        } else {
          console.error("Failed to check status:", data.message);
        }
      } else {
        console.error("Status check failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error checking restaurant status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check status on component mount and set up interval
  useEffect(() => {
    // Initial check
    checkRestaurantStatus();

    // Set up interval to check every 5 minutes
    const interval = setInterval(() => {
      checkRestaurantStatus();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Also check status when the page becomes visible (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkRestaurantStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleCloseAlert = () => {
    setShowInactiveAlert(false);
  };

  const handleContactSupport = () => {
    // Implement contact support logic
    window.open("tel:+919876543210", "_self");
    // Or open email: window.location.href = 'mailto:support@restaurant.com';
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Main content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <h2 className="mb-4">Restaurant Dashboard</h2>
        <NotActive />
        {/* Row 1: Status cards */}
        <StatusCards />
        {/* Row 2: Recent Orders + Popular Menu */}
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

export default RestaurantDashboard;
