import React from "react";
import "../styles/RestaurantDashbord.css";

const RestaurantDashbord = () => {
  return (
    <>
      <div className="sidebar">
        <h2>
          <i className="fas fa-shield-alt"></i> Admin Panel
        </h2>
        <nav>
          <div className="nav-item">
            <a href="/admin/dashboard" className="active">
              <i className="fas fa-home"></i> Dashboard
            </a>
          </div>
          <div className="nav-item">
            <a href="/admin/products">
              <i className="fas fa-box"></i> Products
            </a>
          </div>
          <div className="nav-item">
            <a href="/admin/sell-requests">
              <i className="fas fa-shopping-cart"></i> Sell Requests
            </a>
          </div>
          <div className="nav-item">
            <a href="/admin/orders/pending">
              <i className="fa-solid fa-bag-shopping"></i> Pending Orders
            </a>
          </div>
          <div className="nav-item">
            <a href="/admin/orders/shipment">
              <i className="fa-solid fa-truck"></i> Pending Shipment
            </a>
          </div>
          <div className="nav-item">
            <a href="/admin/queries">
              <i className="fas fa-question-circle"></i> Queries
            </a>
          </div>
          <div className="nav-item">
            <a href="/admin/posts">
              <i className="fas fa-comments"></i> Community Posts
            </a>
          </div>
          <div className="nav-item">
            <a href="/admin/users">
              <i className="fas fa-users"></i> Users
            </a>
          </div>
          <div className="nav-item">
            <a href="/logout">
              <i className="fas fa-sign-out-alt"></i> Logout
            </a>
          </div>
        </nav>
      </div>

      <div className="content">
        <div className="page-header">
          <span id="currentDate"></span>
        </div>

        {/* Dashboard Stats */}
        <div className="stats-grid">
          <a
            href="/admin/users"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-card users">
              <h3>
                <i className="fas fa-users"></i> Total Users
              </h3>
              <div className="number">{/* Insert User Count */}</div>
            </div>
          </a>

          <a
            href="/admin/products"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-card products">
              <h3>
                <i className="fas fa-box"></i> Products
              </h3>
              <div className="number">{/* Insert Products Count */}</div>
            </div>
          </a>

          <a
            href="/admin/sell-requests"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-card requests">
              <h3>
                <i className="fas fa-shopping-cart"></i> Sell Requests
              </h3>
              <div className="number">{/* Insert Requests Count */}</div>
            </div>
          </a>

          <a
            href="/admin/queries"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-card queries">
              <h3>
                <i className="fas fa-question-circle"></i> Pending Queries
              </h3>
              <div className="number">{/* Insert Queries Count */}</div>
            </div>
          </a>

          <a
            href="/admin/orders/pending"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-card requests">
              <h3>
                <i className="fa-solid fa-bag-shopping"></i> Pending Orders
              </h3>
              <div className="number">{/* Insert Orders Count */}</div>
            </div>
          </a>

          <a
            href="/admin/orders/shipment"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-card requests">
              <h3>
                <i className="fa-solid fa-truck"></i> Pending Shipment
              </h3>
              <div className="number">{/* Insert Shipment Count */}</div>
            </div>
          </a>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button
              className="action-btn"
              onClick={() => (window.location.href = "/admin/products")}
            >
              <i className="fas fa-plus"></i> Add New Product
            </button>
            <button
              className="action-btn"
              onClick={() => (window.location.href = "/admin/sell-requests")}
            >
              <i className="fas fa-clipboard-check"></i> Review Requests
            </button>
            <button className="action-btn">
              <i className="fas fa-envelope"></i> Check Messages
            </button>
          </div>
        </div>
      </div>

      <button className="hamburger-menu" id="menuToggle">
        <i className="fas fa-bars"></i>
      </button>
    </>
  );
};

export default RestaurantDashbord;
