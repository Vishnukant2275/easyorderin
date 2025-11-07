// src/hooks/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/auth/check-session", {
          withCredentials: true, // ✅ send session cookie
        });

        if (res.data.loggedIn) {
          setIsValidSession(true);
          sessionStorage.setItem("isLoggedIn", "true");
        } else {
          sessionStorage.removeItem("isLoggedIn");
        }
      } catch (err) {
        console.error("❌ Session check failed:", err);
        sessionStorage.removeItem("isLoggedIn");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return <div>🔍 Checking session...</div>;

  return isValidSession ? children : <Navigate to="/restaurant/login" replace />;
};

export default ProtectedRoute;
