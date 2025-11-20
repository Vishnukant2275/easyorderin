import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./App.css";
import App from "./App.jsx";
import { RestaurantProvider } from "./context/RestaurantContext";
import { UserProvider } from "./context/UserContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import { RestaurantProvider as AdminRestaurantProvider } from "./context/AdminRestaurantContext.jsx";
import { AdminUserProvider } from "./context/AdminUserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <RestaurantProvider>
        <UserProvider>
          <AdminRestaurantProvider>
            <AdminUserProvider>
              <App />
            </AdminUserProvider>
          </AdminRestaurantProvider>
        </UserProvider>
      </RestaurantProvider>
    </AdminProvider>
  </StrictMode>
);
