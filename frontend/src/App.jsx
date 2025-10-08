import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
// routers import
import RestaurantRouter from "./router/RestaurantRouter";
import UserRouter from "./router/UserRouter";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Home from "./layouts/Home";
import RestaurantDashboard from "./layouts/RestaurantDashboard";
import StatusCards from "./components/StatusCards";

import DashboardRouter from "./router/DashboardRouter";
import User from "./layouts/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<AboutPage />} />
          <Route path="status" element={<StatusCards />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="restaurant/*" element={<RestaurantRouter />} />
        </Route>

        {/* Separate route for dashboard - not nested under Home */}
        <Route path="/dashboard/*" element={<DashboardRouter />} />
        <Route path="/user/*" element={<UserRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
