import { Routes, Route } from "react-router-dom";
import RestaurantDashboard from "../layouts/RestaurantDashboard";
import RestaurantDashbord from "../pages/RestaurantDashbord";
import Menu from "../pages/Menu";
import PendingOrder from "../pages/PendingOrder"
import Preparing from "../pages/Preparing";
import Served from "../pages/Served";
import Staff from "../pages/Staff";
import Table from "../pages/Table";
import Analytics from "../pages/Analytics";
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
        {/* Add other dashboard nested routes here */}
      </Route>
    </Routes>
  );
}

export default DashboardRouter;
