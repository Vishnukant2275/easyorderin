import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  // Set default authorization header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Auto login if token exists
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/admin/profile");
        if (data.success) {
          setAdmin(data.data);
        } else {
          // Token is invalid
          localStorage.removeItem("adminToken");
          setToken(null);
        }
      } catch (error) {
        console.error("Admin auto-login failed", error);
        localStorage.removeItem("adminToken");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/admin/login", { email, password });

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
        setAdmin(data.data);
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setAdmin(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put("/admin/profile", profileData);

      if (data.success) {
        setAdmin(data.data);
        return {
          success: true,
          data: data.data,
          message: "Profile updated successfully",
        };
      } else {
        return {
          success: false,
          message: data.message || "Profile update failed",
        };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const { data } = await api.put("/admin/change-password", {
        currentPassword,
        newPassword,
      });

      if (data.success) {
        return {
          success: true,
          message: data.message || "Password changed successfully",
        };
      } else {
        return {
          success: false,
          message: data.message || "Password change failed",
        };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      return { success: false, message };
    }
  };

  const getDashboardStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return {
          success: false,
          message: data.message || "Failed to fetch stats",
        };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch dashboard statistics";
      return { success: false, message };
    }
  };

  const hasPermission = (permission) => {
    if (!admin) return false;

    // Super admin has all permissions
    if (admin.role === "super_admin") return true;

    // Check specific permission
    return admin.permissions?.[permission] === true;
  };

  const isSuperAdmin = () => {
    return admin?.role === "super_admin";
  };

  const isAdminActive = () => {
    return admin?.isActive === true;
  };

  const refreshAdmin = async () => {
    try {
      const { data } = await api.get("/admin/profile");
      if (data.success) {
        setAdmin(data.data);
        return { success: true, data: data.data };
      }
    } catch (error) {
      console.error("Failed to refresh admin data", error);
      return { success: false, message: "Failed to refresh admin data" };
    }
  };

  const value = {
    // State
    admin,
    loading,
    token,

    // Authentication
    login,
    logout,

    // Profile Management
    updateProfile,
    changePassword,
    refreshAdmin,

    // Permissions & Roles
    hasPermission,
    isSuperAdmin,
    isAdminActive,

    // Dashboard
    getDashboardStats,

    // Helper functions
    isAuthenticated: !!admin && !!token,
    isLoaded: !loading,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// Custom hook with better error message
export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error(
      "useAdmin must be used within an AdminProvider. Make sure you've wrapped your app with <AdminProvider>."
    );
  }

  return context;
};
