import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaList,
  FaFire,
  FaCheckCircle,
  FaEllipsisH,
} from "react-icons/fa";
import { useRestaurant } from "../context/RestaurantContext";

const RestaurantSidebar = () => {
  const navigate = useNavigate();
  const { restaurant, loading, error } = useRestaurant();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const location = useLocation();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close menus when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile) {
        const sidebar = document.querySelector(".restaurant-sidebar");
        const hamburger = document.querySelector(".hamburger-btn");
        const moreMenu = document.querySelector(".more-menu");

        if (isMenuOpen) {
          if (
            sidebar &&
            !sidebar.contains(event.target) &&
            hamburger &&
            !hamburger.contains(event.target)
          ) {
            setIsMenuOpen(false);
          }
        }

        if (showMoreMenu && moreMenu && !moreMenu.contains(event.target)) {
          setShowMoreMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isMenuOpen, showMoreMenu]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isMobile && isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
      setShowMoreMenu(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/restaurant/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logged out successfully");
        sessionStorage.removeItem("isLoggedIn");
        window.location.href = "/restaurant/login";
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <>
          <div className="mobile-bottom-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
              end
            >
              <FaHome size={20} />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/dashboard/pending-orders"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaList size={20} />
              <span>Pending</span>
            </NavLink>

            <NavLink
              to="/dashboard/preparing"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaFire size={20} />
              <span>Preparing</span>
            </NavLink>

            <NavLink
              to="/dashboard/served"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaCheckCircle size={20} />
              <span>Served</span>
            </NavLink>

            <div
              className={`nav-item more-button ${showMoreMenu ? "active" : ""}`}
              onClick={toggleMoreMenu}
            >
              <FaEllipsisH size={20} />
              <span>More</span>
            </div>
          </div>

          {/* More Menu Dropdown */}
          {showMoreMenu && (
            <div className="more-menu">
              <NavLink
                to="/dashboard/tables"
                className={({ isActive }) =>
                  `more-menu-item ${isActive ? "active" : ""}`
                }
                onClick={closeMenu}
              >
                <i className="bi bi-grid-3x3-gap me-2"></i> Manage Tables
              </NavLink>
              <NavLink
                to="/dashboard/menu"
                className={({ isActive }) =>
                  `more-menu-item ${isActive ? "active" : ""}`
                }
                onClick={closeMenu}
              >
                <i className="bi bi-journal-text me-2"></i> Menu Management
              </NavLink>
              <NavLink
                to="/dashboard/payment"
                className={({ isActive }) =>
                  `more-menu-item ${isActive ? "active" : ""}`
                }
                onClick={closeMenu}
              >
                <i className="bi bi-credit-card me-2"></i> Payment Options
              </NavLink>
              <NavLink
                to="/dashboard/analytics"
                className={({ isActive }) =>
                  `more-menu-item ${isActive ? "active" : ""}`
                }
                onClick={closeMenu}
              >
                <i className="bi bi-graph-up me-2"></i> Analytics{" "}
              </NavLink>
              <NavLink
                to="/dashboard/staff"
                className={({ isActive }) =>
                  `more-menu-item ${isActive ? "active" : ""}`
                }
                onClick={closeMenu}
              >
                <i className="bi bi-people me-2"></i> Staff Management
              </NavLink>
              <div className="more-menu-item" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </div>
            </div>
          )}

          {/* Overlay for more menu */}
          {showMoreMenu && (
            <div className="mobile-overlay" onClick={closeMenu}></div>
          )}
        </>
      )}

      {/* Mobile Header with Hamburger Button - Only show when sidebar is needed */}
      {isMobile && (
        <div className="mobile-header">
          <button
            className="hamburger-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className="mobile-brand">
            <i className="bi bi-restaurant me-2"></i>
            <span className="brand-text">
              {restaurant?.restaurantName || "My Restaurant"}
            </span>
          </div>
          <div
            className="user-avatar-mobile"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt size={24} className="logout-icon" />
            <style jsx>{`
              .user-avatar-mobile {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #dc3545; /* Bootstrap red */
                transition: all 0.3s ease;
              }
              .user-avatar-mobile:hover {
                color: #b02a37;
                transform: scale(1.1);
              }
            `}</style>
          </div>
        </div>
      )}
      {/* Mobile Overlay for sidebar */}
      {isMobile && isMenuOpen && (
        <div className="mobile-overlay" onClick={closeMenu}></div>
      )}

      {/* Sidebar - Hidden on mobile except when menu is open */}
      <div
        className={`restaurant-sidebar ${isMobile ? "mobile" : ""} ${
          isMenuOpen ? "open" : ""
        }`}
      >
        <div
          className="d-flex flex-column flex-shrink-0 p-3 text-white sidebar-content"
          style={{
            width: "229px",
            minHeight: "50vh",
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
                to="/dashboard/payment"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                onClick={closeMenu}
              >
                <i className="bi bi-credit-card me-2"></i> Payment Options
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
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </>
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

            /* Mobile bottom navigation */
            .mobile-bottom-nav {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              height: 60px;
              background:white;
              
              display: flex;
              align-items: center;
              justify-content: space-around;
              border-top: 1px solid #e0e0e0;
              z-index: 1000;
              box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            }

            .mobile-bottom-nav .nav-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              flex: 1;
              height: 100%;
              text-decoration: none;
              color: #666;
              font-size: 0.75rem;
              transition: all 0.3s ease;
              padding: 8px 4px;
            }

            .mobile-bottom-nav .nav-item.active {
              color: #0d6efd;
              background: rgba(13, 110, 253, 0.05);
            }

            .mobile-bottom-nav .nav-item:hover {
              color: #0d6efd;
            }

            .mobile-bottom-nav .nav-item span {
              margin-top: 4px;
              font-weight: 500;
            }

            .more-button {
              cursor: pointer;
            }

            /* More menu */
            .more-menu {
              position: fixed;
              bottom: 70px;
              right: 10px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
              z-index: 1002;
              min-width: 200px;
              overflow: hidden;
            }

            .more-menu-item {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              text-decoration: none;
              color: #333;
              border-bottom: 1px solid #f0f0f0;
              transition: background-color 0.3s;
              font-size: 0.9rem;
            }

            .more-menu-item:last-child {
              border-bottom: none;
            }

            .more-menu-item:hover {
              background: #f8f9fa;
            }

            .more-menu-item.active {
              background: rgba(13, 110, 253, 0.1);
              color: #0d6efd;
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
                padding-bottom: 70px;
              }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default RestaurantSidebar;
