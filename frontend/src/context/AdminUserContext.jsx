import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AdminUserContext = createContext();

export const AdminUserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users with proper state management
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/admin/users?t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch users";
      setError(errorMessage);

      // If it's a 401, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/toggle-status`);

      if (data.success) {
        // Update the user in local state
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  status: user.status === "active" ? "inactive" : "active",
                }
              : user
          )
        );
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update user status";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Get user by ID
  const getUserById = async (userId) => {
    try {
      const { data } = await api.get(`/admin/users/${userId}`);

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user";
      return { success: false, message: errorMessage };
    }
  };

  // Get user orders
  const getUserOrders = async (userId) => {
    try {
      const { data } = await api.get(`/admin/users/${userId}/orders`);

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user orders";
      return { success: false, message: errorMessage };
    }
  };

  // Refresh users
  const refreshUsers = async () => {
    await fetchUsers();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    users,
    loading,
    error,

    // Actions
    toggleUserStatus,
    getUserById,
    getUserOrders,
    refreshUsers,
    clearError,
    fetchUsers, // Export fetchUsers for manual calls

    // Helper functions
    hasUsers: users.length > 0,
    activeUsers: users.filter((u) => u.status === "active"),
    inactiveUsers: users.filter((u) => u.status === "inactive"),
    totalUsers: users.length,
  };

  return (
    <AdminUserContext.Provider value={value}>
      {children}
    </AdminUserContext.Provider>
  );
};

export const useAdminUser = () => {
  const context = useContext(AdminUserContext);

  if (context === undefined) {
    throw new Error("useAdminUser must be used within an AdminUserProvider");
  }

  return context;
};
