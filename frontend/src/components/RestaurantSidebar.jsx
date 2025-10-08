import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useRestaurant } from "../context/RestaurantContext";
import api from "../services/api";

const RestaurantSidebar = () => {
  const { restaurant, loading, error } = useRestaurant();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="restaurant-sidebar">
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-white"
        style={{
          width: "280px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #1f1f1f, #3a3a3a)",
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
          boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
        }}
      >
        {/* Brand */}
        <NavLink
          to="/"
          className="d-flex align-items-center mb-4 text-white text-decoration-none"
        >
          <i className="bi bi-restaurant me-2 fs-3"></i>
          <span className="fs-4 fw-bold">My Restaurant</span>
        </NavLink>

        <hr className="text-secondary" />

        {/* Navigation */}
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active" : ""}`
              }
              end
            >
              <i className="bi bi-house-door me-2"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/pending-orders"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-hourglass-split me-2"></i> Pending Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/preparing"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-fire me-2"></i> Preparing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/served"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-check2-circle me-2"></i> Served
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/tables"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-grid-3x3-gap me-2"></i> Manage Tables
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/menu"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-journal-text me-2"></i> Menu Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/analytics"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-graph-up me-2"></i> Analytics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/staff"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-people me-2"></i> Staff Management
            </NavLink>
          </li>
        </ul>

        <hr className="text-secondary" />

        {/* User Dropdown */}
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserCircle size={32} className="me-2" />
            <strong>{restaurant?.restaurantName || "Restaurant"}</strong>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-gear me-2"></i> Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-person me-2"></i> Profile
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-box-arrow-right me-2"></i> Sign out
              </a>
            </li>
          </ul>
        </div>
        <button
          className="btn btn-outline-danger mt-3 w-100"
          style={{
            borderRadius: "10px",
            transition: "all 0.3s ease",
          }}
          onClick={async () => {
            window.location.href = "/restaurant/login";
            try {
              // Call your backend logout endpoint
              const response = await fetch("/api/restaurant/logout", {
                method: "POST",
                credentials: "include", // important if using cookies for session
              });

              if (response.ok) {
                console.log("Logged out successfully");
                // Redirect to login page after logout
                window.location.href = "/restaurant/login";
              } else {
                console.error("Logout failed");
              }
            } catch (err) {
              console.error("Error logging out:", err);
            }
          }}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>

      {/* Extra CSS for hover + active */}
      <style>
        {`
          .restaurant-sidebar .nav-link {
            border-radius: 12px;
            padding: 10px 15px;
            transition: all 0.3s ease;
          }
          .restaurant-sidebar .nav-link:hover {
            background: rgba(255,255,255,0.15);
          }
          .restaurant-sidebar .nav-link.active {
            background: #0d6efd;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

export default RestaurantSidebar;
