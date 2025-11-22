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
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/auth/check-auth",
          {
            withCredentials: true, // send session cookie
          }
        );

        if (res.data.loggedIn) {
          setIsValidSession(true);
          sessionStorage.setItem("userLoggedIn", "true");
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
