import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useRestaurant } from "../context/RestaurantContext";

const StatusCards = () => {
  const { menuItems, table, orders } = useRestaurant();

  // Memoize the filtered counts to avoid recalculating on every render
  const pendingOrdersCount = orders.filter((order) => order?.status === "pending").length;
  const preparingOrdersCount = orders.filter((order) => order?.status === "preparing").length;
  const servedOrdersCount = orders.filter((order) => order?.status === "served").length;

  const cardData = [
    {
      title: "Pending Orders",
      value: pendingOrdersCount,
      bg: "bg-primary",
      url: "/pending-orders",
      icon: "⏳", // Add icons for better UX
    },
    {
      title: "Preparing Orders",
      value: preparingOrdersCount,
      bg: "bg-warning",
      url: "/preparing", // Fixed URL consistency
      icon: "👨‍🍳",
    },
    {
      title: "Served Orders",
      value: servedOrdersCount,
      bg: "bg-success",
      url: "/served", // Fixed URL consistency
      icon: "✅",
    },
    { 
      title: "Tables", 
      value: table?.length || 0, // Added null check
      bg: "bg-info", 
      url: "/tables",
      icon: "🪑",
    },
    {
      title: "Menu Items",
      value: menuItems?.length || 0, // Added null check
      bg: "bg-danger",
      url: "/menu",
      icon: "📋",
    },
    { 
      title: "Payment Options", 
      value: 4, 
      bg: "bg-secondary", 
      url: "/payment",
      icon: "💳",
    },
  ];

  return (
    <div className="row">
      {cardData.map((card, index) => (
        <div key={index} className="col-md-4 mb-4">
          <Link to={`/dashboard${card.url}`} className="text-decoration-none">
            <div className={`card text-white ${card.bg} shadow rounded-3 h-100 hover-scale`} style={{ transition: 'transform 0.2s' }}>
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <div className="mb-2" style={{ fontSize: '2rem' }}>
                  {card.icon}
                </div>
                <h5 className="card-title mb-2">{card.title}</h5>
                <h2 className="mb-0">{card.value}</h2>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default StatusCards;