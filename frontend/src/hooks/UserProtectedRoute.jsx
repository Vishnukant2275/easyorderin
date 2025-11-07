// src/hooks/UserProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const UserProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await axios.get("/api/auth/check-auth", {
          withCredentials: true, // important for cookie/session
        });

        if (res.data.loggedIn) {
          setIsValidSession(true);
        } else {
          setIsValidSession(false);
          sessionStorage.removeItem("userLoggedIn");
        }
      } catch (err) {
        console.error("User session check failed:", err);
        setIsValidSession(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h5>Checking user session...</h5>
      </div>
    );
  }

  if (!isValidSession) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
