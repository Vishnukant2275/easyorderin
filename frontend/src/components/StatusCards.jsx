import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useRestaurant } from "../context/RestaurantContext";

const StatusCards = () => {
  const { menuItems,table } = useRestaurant();
  const cardData = [
    {
      title: "Pending Orders",
      value: 25,
      bg: "bg-primary",
      url: "/pending-orders",
    },
    {
      title: "Preparing Orders",
      value: 12,
      bg: "bg-warning",
      url: "/preparing",
    },
    { title: "Served Orders", value: 45, bg: "bg-success", url: "/served" },
    { title: "Tables", value: table.length, bg: "bg-info", url: "/tables" },
    {
      title: "Menu Items",
      value: menuItems.length,
      bg: "bg-danger",
      url: "/menu",
    },
    { title: "Payment Options", value: 4, bg: "bg-secondary", url: "/payment" },
  ];

  return (
    <div className="row">
      {cardData.map((card, index) => (
        <div key={index} className="col-md-4 mb-4">
          <Link to={`/dashboard${card.url}`} className="text-decoration-none">
            <div className={`card text-white ${card.bg} shadow rounded-3`}>
              <div className="card-body text-center">
                <h5 className="card-title">{card.title}</h5>
                <h2>{card.value}</h2>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default StatusCards;
