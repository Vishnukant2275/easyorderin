import React from "react";
import "./UserHeader.css";

const UserHeader = () => {
  return (
    <header className="user-header">
      <div className="header-content">
        <div className="restaurant-info">
          <h1 className="restaurant-name">Restaurant Name</h1>
          <div className="table-info">
            <span className="table-label">Table</span>
            <span className="table-number">05</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn">
            <span className="icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
