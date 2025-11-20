import React, { createContext, useContext, useState, useEffect } from "react";
import ChatBox from "../components/ChantBox";
import api from "../services/api";
const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [table, setTable] = useState([]);
  const [paymentQRCodes, setPaymentQRCodes] = useState([]);
  const [loadingQRCodes, setLoadingQRCodes] = useState(false);
  const [qrError, setQRError] = useState("");
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
        // assuming res.data contains restaurant info
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
      } catch (err) {
        console.error("Error fetching tables:", err);
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

          // Log user data to verify it's populated
          res.data.orders.forEach((order) => {
            console.log(`Order ${order._id}:`, {
              userName: order.userId?.name,
              userPhone: order.userId?.phone,
              formattedOrderNumber:
                order.formattedOrderNumber ||
                `ORD-${order.orderNumber?.toString().padStart(3, "0")}`,
            });
          });
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
  }, [refreshTrigger]);

  //fetching payment methods
  useEffect(() => {
    const fetchPaymentQRCodes = async () => {
      try {
        setLoadingQRCodes(true);
        setQRError("");

        const res = await api.get("/restaurant/get-paymentqr", {
          withCredentials: true,
        });

        if (res.data?.success && Array.isArray(res.data.qrCodes)) {
          setPaymentQRCodes(res.data.qrCodes);
        } else {
          setPaymentQRCodes([]);
          setQRError(res.data?.error || "No QR codes found");
        }
      } catch (error) {
        console.error("Error fetching QR codes:", error);
        setPaymentQRCodes([]);
        setQRError(
          error.response?.data?.error || "Failed to fetch QR codes from server"
        );
      } finally {
        setLoadingQRCodes(false);
      }
    };

    fetchPaymentQRCodes();
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        setRestaurant,
        menuItems,
        setMenuItems,
        paymentQRCodes,
        setPaymentQRCodes,
        loadingQRCodes,
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
