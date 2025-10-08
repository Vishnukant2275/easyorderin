import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserFooter.css";

const UserFooter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");

  const footerItems = [
    { key: "menu", label: "Menu", icon: "📋", path: "/menu" },
    { key: "cart", label: "Cart", icon: "🛒", path: "/cart" },
    { key: "orders", label: "Orders", icon: "📦", path: "/orders" },
    { key: "account", label: "Account", icon: "👤", path: "/account" },
  ];

  // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = footerItems.find(
      (item) =>
        currentPath === item.path || currentPath.startsWith(item.path + "/")
    );
    if (activeItem) {
      setActiveTab(activeItem.key);
    }
  }, [location.pathname]);

  const handleTabClick = (item) => {
    setActiveTab(item.key);
    navigate(item.path);
  };

  return (
    <footer className="user-footer">
      <div className="footer-nav">
        {footerItems.map((item) => (
          <button
            key={item.key}
            className={`footer-nav-item ${
              activeTab === item.key ? "active" : ""
            }`}
            onClick={() => handleTabClick(item)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default UserFooter;
