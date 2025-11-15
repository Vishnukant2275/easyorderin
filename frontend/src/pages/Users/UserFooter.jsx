import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./UserFooter.css";

const UserFooter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantID, tableNumber } = useParams();
  const [activeTab, setActiveTab] = useState("menu");

  const footerItems = [
    {
      key: "menu",
      label: "Menu",
      icon: "📋",
      path: `/restaurant/${restaurantID}/table/${tableNumber}/getMenu`,
    },
    {
      key: "cart",
      label: "Cart",
      icon: "🛒",
      path: `/restaurant/${restaurantID}/table/${tableNumber}/cart`,
    },
    {
      key: "orders",
      label: "Orders",
      icon: "📦",
      path: `/restaurant/${restaurantID}/table/${tableNumber}/orders`,
    },
    {
      key: "account",
      label: "Account",
      icon: "👤",
      path: `/restaurant/${restaurantID}/table/${tableNumber}/account`,
    },
  ];

  // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check which tab matches the current path
    const activeItem = footerItems.find((item) => {
      // Exact match
      if (currentPath === item.path) return true;
      
      // Match base path (for nested routes)
      const basePath = `/restaurant/${restaurantID}/table/${tableNumber}`;
      if (currentPath.startsWith(basePath)) {
        const currentSection = currentPath.replace(basePath, "").split("/")[1];
        const itemSection = item.path.replace(basePath, "").split("/")[1];
        return currentSection === itemSection;
      }
      
      return false;
    });
    
    if (activeItem) {
      setActiveTab(activeItem.key);
    }
  }, [location.pathname, restaurantID, tableNumber]);

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