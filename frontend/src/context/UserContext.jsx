import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.get("/auth/check-auth", {
        withCredentials: true, // Important for session cookies
      });

      if (response.data.authenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);

        // Optionally fetch full user profile
        try {
          const profileResponse = await api.get("/auth/me", {
            withCredentials: true,
          });
          if (profileResponse.data.success) {
            setUser(profileResponse.data.data);
          }
        } catch (profileError) {
          console.warn("Failed to fetch full profile:", profileError);
          // Continue with basic user data from check-auth
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      // Don't set error here as it might be normal for non-authenticated users
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOtp = async (phone) => {
    try {
      setError(null);
      const response = await api.post("/auth/send-otp", { phone });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Verify OTP and login
  const verifyOtp = async (phone, otp) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.post(
        "/auth/verify-otp",
        { phone, otp },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      } else {
        setError(response.data.message);
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (phone) => {
    try {
      setError(null);
      const response = await api.post("/auth/resend-otp", { phone });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  // Update user profile
  const updateUser = async (updateData) => {
    try {
      if (!user?._id) {
        throw new Error("No user logged in");
      }

      const response = await api.put(`/user/${user._id}`, updateData, {
        withCredentials: true,
      });

      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Update failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Get user orders
  const getUserOrders = async (userId = user?._id) => {
    try {
      if (!userId) {
        throw new Error("User ID required");
      }

      const response = await api.get(`/user/${userId}/orders`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch orders";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    error,

    // Auth methods
    sendOtp,
    verifyOtp,
    resendOtp,
    logout,
    checkAuthStatus,

    // User methods
    updateUser,
    getUserOrders,

    // Utility methods
    clearError,
    setError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
