import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./App.css";
import App from "./App.jsx";
import { RestaurantProvider } from "./context/RestaurantContext";
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RestaurantProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </RestaurantProvider>
  </StrictMode>
);
