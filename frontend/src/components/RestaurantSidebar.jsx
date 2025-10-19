import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useRestaurant } from "../context/RestaurantContext";
import api from "../services/api";

const RestaurantSidebar = () => {
  const { restaurant, loading, error } = useRestaurant();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isMenuOpen) {
        const sidebar = document.querySelector('.restaurant-sidebar');
        const hamburger = document.querySelector('.hamburger-btn');
        
        if (sidebar && !sidebar.contains(event.target) && 
            hamburger && !hamburger.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMenuOpen]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isMobile && isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {/* Mobile Header with Hamburger Button */}
      {isMobile && (
        <div className="mobile-header">
          <button 
            className="hamburger-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <div className="mobile-brand">
            <i className="bi bi-restaurant me-2"></i>
            <span>My Restaurant</span>
          </div>
          <div className="user-avatar-mobile">
            <FaUserCircle size={28} />
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`restaurant-sidebar ${isMobile ? 'mobile' : ''} ${isMenuOpen ? 'open' : ''}`}
      >
        <div
          className="d-flex flex-column flex-shrink-0 p-3 text-white sidebar-content"
          style={{
            width: "280px",
            minHeight: "100vh",
            background: "linear-gradient(180deg, #1f1f1f, #3a3a3a)",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
            boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
          }}
        >
          {/* Brand - Hidden on mobile */}
          {!isMobile && (
            <>
              <NavLink
                to="/"
                className="d-flex align-items-center mb-4 text-white text-decoration-none"
                onClick={closeMenu}
              >
                <i className="bi bi-restaurant me-2 fs-3"></i>
                <span className="fs-4 fw-bold">My Restaurant</span>
              </NavLink>

              <hr className="text-secondary" />
            </>
          )}

          {/* Navigation */}
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                onClick={closeMenu}
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
                onClick={closeMenu}
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
                onClick={closeMenu}
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
                onClick={closeMenu}
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
                onClick={closeMenu}
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
                onClick={closeMenu}
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
                onClick={closeMenu}
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
                onClick={closeMenu}
              >
                <i className="bi bi-people me-2"></i> Staff Management
              </NavLink>
            </li>
          </ul>

          <hr className="text-secondary" />

          {/* User Dropdown - Hidden on mobile */}
          {!isMobile && (
            <>
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
                  try {
                    // Call your backend logout endpoint
                    const response = await fetch("/api/restaurant/logout", {
                      method: "POST",
                      credentials: "include",
                    });

                    if (response.ok) {
                      console.log("Logged out successfully");
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
            </>
          )}

          {/* Mobile-only logout button */}
          {isMobile && (
            <button
              className="btn btn-outline-danger mt-3 w-100"
              style={{
                borderRadius: "10px",
                transition: "all 0.3s ease",
              }}
              onClick={async () => {
                try {
                  const response = await fetch("/api/restaurant/logout", {
                    method: "POST",
                    credentials: "include",
                  });

                  if (response.ok) {
                    console.log("Logged out successfully");
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
          )}
        </div>

        {/* CSS Styles */}
        <style>
          {`
            /* Base styles */
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

            /* Mobile header */
            .mobile-header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              height: 60px;
              background: linear-gradient(180deg, #1f1f1f, #3a3a3a);
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 20px;
              z-index: 1001;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }

            .hamburger-btn {
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 8px;
              border-radius: 4px;
              transition: background-color 0.3s;
            }

            .hamburger-btn:hover {
              background: rgba(255,255,255,0.1);
            }

            .mobile-brand {
              color: white;
              font-weight: bold;
              font-size: 1.2rem;
              display: flex;
              align-items: center;
            }

            .user-avatar-mobile {
              color: white;
            }

            /* Mobile overlay */
            .mobile-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.5);
              z-index: 999;
            }

            /* Mobile sidebar styles */
            .restaurant-sidebar.mobile {
              position: fixed;
              top: 60px;
              left: -280px;
              z-index: 1000;
              transition: left 0.3s ease;
            }

            .restaurant-sidebar.mobile.open {
              left: 0;
            }

            .restaurant-sidebar.mobile .sidebar-content {
              border-radius: 0;
              border-bottom-right-radius: 20px;
            }

            /* Desktop styles */
            .restaurant-sidebar:not(.mobile) {
              position: relative;
            }

            /* Responsive adjustments */
            @media (max-width: 767px) {
              body {
                padding-top: 60px;
              }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default RestaurantSidebar;