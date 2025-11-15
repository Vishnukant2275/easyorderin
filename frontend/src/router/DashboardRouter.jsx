import { Routes, Route } from "react-router-dom";
import RestaurantDashboard from "../layouts/RestaurantDashboard";
import RestaurantDashbord from "../pages/Restaurant/RestaurantDashbord";
import Menu from "../pages/Restaurant/Menu";
import PendingOrder from "../pages/Restaurant/PendingOrder";
import Preparing from "../pages/Restaurant/Preparing";
import Served from "../pages/Restaurant/Served";
import Staff from "../pages/Restaurant/Staff";
import Table from "../pages/Restaurant/Table";
import Analytics from "../pages/Restaurant/Analytics";
import Payment from "../pages/Restaurant/Payment";
import TotalOrders from "../pages/Restaurant/TotalOrder";
import PageNotFound from "../pages/PageNotFound";

function DashboardRouter() {
  return (
    <Routes>
      <Route element={<RestaurantDashboard />}>
        <Route index element={<RestaurantDashbord />} />
        <Route path="menu" element={<Menu />} />
        <Route path="pending-orders" element={<PendingOrder />} />
        <Route path="preparing" element={<Preparing />} />
        <Route path="served" element={<Served />} />
        <Route path="tables" element={<Table />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="staff" element={<Staff />} />
        <Route path="payment" element={<Payment />} />
        <Route path="orders" element={<TotalOrders />} />
        <Route
          path="*"
          element={
            <PageNotFound homeUrl="/dashboard" buttonText="Back to Dashboard" />
          }
        />

        {/* Add other dashboard nested routes here */}
      </Route>
    </Routes>
  );
}

export default DashboardRouter;
