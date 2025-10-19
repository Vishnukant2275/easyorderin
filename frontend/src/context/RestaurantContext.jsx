import React, { createContext, useContext, useState, useEffect } from "react";
import ChatBox from "../components/ChantBox";
import api from "../services/api";
const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [table, setTable] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  //fetching restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const res = await api.get("/restaurant/me"); // backend endpoint
        setRestaurant(res.data.restaurant);
        console.log("Restaurant response:", res.data); // assuming res.data contains restaurant info
      } catch (err) {
        console.error("Error fetching restaurant info:", err);
        setError("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [refreshTrigger]);
//fetching menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/restaurant/menu");
        console.log("Menu response:", res.data);

        if (
          Array.isArray(res.data) &&
          res.data.length > 0 &&
          res.data[0].items
        ) {
          setMenuItems(res.data[0].items);
        } else {
          setMenuItems([]);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };

    fetchMenu();
  }, [refreshTrigger]);
//fetching table data
  useEffect(() => {
    const getTables = async () => {
      try {
        const res = await api.get("/restaurant/tables");
        setTable(res.data[0].tables || []);
        console.log("Tables:", res.data[0].tables);
      } catch (err) {
        console.log("Error fetching tables:", err);
      }
    };
    getTables();
  }, [refreshTrigger]);

  //fetching order data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/restaurant/orders");
        if (res.data.success && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
          console.log("Orders:" , res.data.orders)
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);




  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        setRestaurant,
        menuItems,
        setMenuItems,

        orders,
        setOrders,
        table,
        setTable,
        refreshTrigger,
        setRefreshTrigger,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

// Custom hook to use restaurant context
export const useRestaurant = () => useContext(RestaurantContext);
