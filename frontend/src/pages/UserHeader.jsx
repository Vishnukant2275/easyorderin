import React, { useState, useEffect } from "react";
import "./UserHeader.css";
import { useParams } from "react-router-dom";
import api from "../services/api";

const UserHeader = () => {
  const { restaurantID, tableNumber } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!restaurantID) {
          setError("Restaurant ID not found");
          setLoading(false);
          return;
        }

        const res = await api.get(`/restaurant/${restaurantID}`);

        if (res.data.success) {
          setRestaurant(res.data.restaurant);
        } else {
          setError(res.data.message || "Failed to fetch restaurant data");
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError(err.response?.data?.message || "Failed to load restaurant info");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantID]);

  return (
    <header className="user-header">
      <div className="header-content">
        <div className="restaurant-info">
          {loading ? (
            <h1 className="restaurant-name shimmer">Loading...</h1>
          ) : error ? (
            <h1 className="restaurant-name error">Restaurant Not Found</h1>
          ) : (
            <h1 className="restaurant-name">
              {restaurant?.restaurantName || "Restaurant"}
            </h1>
          )}

          <div className="table-info">
            <span className="table-label">Table</span>
            <span className="table-number glow">{tableNumber || "..."}</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn pulse">
            <span className="icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
        </div>
      </div>

      {/* <div className="offers-banner">
        <div className="offer-content">
          <span className="offer-icon">🎉</span>
          <span className="offer-text">Flat 20% off on all desserts today!</span>
          <span className="offer-arrow">›</span>
        </div>
      </div> */}
    </header>
  );
};

export default UserHeader;
