import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/admin/restaurants");

      if (data.success) {
        setRestaurants(data.data);
      } else {
        setError(data.message || "Failed to fetch restaurants");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError(error.response?.data?.message || "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  // Fetch restaurants on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Toggle restaurant status
  const toggleRestaurantStatus = async (restaurantId) => {
    try {
      const { data } = await api.put(
        `/admin/restaurants/${restaurantId}/toggle-status`
      );

      if (data.success) {
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant._id === restaurantId
              ? {
                  ...restaurant,
                  status:
                    restaurant.status === "active" ? "inactive" : "active",
                }
              : restaurant
          )
        );
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error toggling restaurant status:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update status",
      };
    }
  };

  // Update commission
  const updateCommission = async (restaurantId, commission) => {
    try {
      const { data } = await api.put(
        `/admin/restaurants/${restaurantId}/commission`,
        { commission }
      );

      if (data.success) {
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant._id === restaurantId
              ? { ...restaurant, commission }
              : restaurant
          )
        );
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating commission:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update commission",
      };
    }
  };

  // Update payment method
  const updatePaymentMethod = async (restaurantId, paymentMethod) => {
    try {
      const { data } = await api.put(
        `/admin/restaurants/${restaurantId}/payment-method`,
        { paymentMethod }
      );

      if (data.success) {
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant._id === restaurantId
              ? { ...restaurant, paymentMethod }
              : restaurant
          )
        );
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update payment method",
      };
    }
  };

  // Add new restaurant
  const addRestaurant = async (restaurantData) => {
    try {
      const { data } = await api.post("/admin/restaurants", restaurantData);

      if (data.success) {
        setRestaurants((prev) => [data.data, ...prev]);
        return { success: true, data: data.data, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error adding restaurant:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add restaurant",
      };
    }
  };

  // Get restaurant by ID
  const getRestaurantById = async (restaurantId) => {
    try {
      const { data } = await api.get(`/admin/restaurants/${restaurantId}`);

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch restaurant",
      };
    }
  };

  // Refresh restaurants
  const refreshRestaurants = async () => {
    await fetchRestaurants();
  };

  const value = {
    // State
    restaurants,
    loading,
    error,

    // Actions
    toggleRestaurantStatus,
    updateCommission,
    updatePaymentMethod,
    addRestaurant,
    getRestaurantById,
    refreshRestaurants,

    // Helper functions
    hasRestaurants: restaurants.length > 0,
    activeRestaurants: restaurants.filter((r) => r.status === "active"),
    inactiveRestaurants: restaurants.filter((r) => r.status === "inactive"),
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);

  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }

  return context;
};
