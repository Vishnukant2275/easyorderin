import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
// routers import
import RestaurantRouter from "./router/Restaurantrouter.jsx";
import UserRouter from "./router/UserRouter.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import PageNotFound from "./pages/PageNotFound";
import Home from "./layouts/Home";
import RestaurantDashboard from "./layouts/RestaurantDashboard";
import StatusCards from "./components/StatusCards";
import AdminRouter from "./router/AdminRouter";
import DashboardRouter from "./router/DashboardRouter";
import User from "./layouts/User";
import { ToastContainer } from "react-toastify";

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
        <Route
          path="/restaurant/:restaurantID/table/:tableNumber/*"
          element={<UserRouter />}
        />
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored" // "light", "dark", or "colored"
      />
    </BrowserRouter>
  );
}

export default App;
