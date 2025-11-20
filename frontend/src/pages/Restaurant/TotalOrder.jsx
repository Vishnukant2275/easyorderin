import React, { useState, useEffect } from "react";
import { useRestaurant } from "../../context/RestaurantContext";
import api from "../../services ";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TotalOrders = () => {
  const { restaurant } = useRestaurant();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [summary, setSummary] = useState({
    totalOrders: 0,
    servedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });

  // Fetch all orders
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Filter orders when date range changes
  useEffect(() => {
    filterOrdersByDate();
  }, [orders, dateRange]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/restaurant/orders/all");

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByDate = () => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
    calculateSummary(filtered);
  };

  const calculateSummary = (ordersList) => {
    const totalOrders = ordersList.length;
    const servedOrders = ordersList.filter(
      (order) => order.status === "served"
    ).length;
    const cancelledOrders = ordersList.filter(
      (order) => order.status === "cancelled"
    ).length;

    const totalRevenue = ordersList
      .filter((order) => order.status === "served")
      .reduce((sum, order) => sum + (order.totalPrice || order.total || 0), 0);

    const averageOrderValue =
      servedOrders > 0 ? totalRevenue / servedOrders : 0;

    setSummary({
      totalOrders,
      servedOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue,
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning", text: "Pending" },
      preparing: { class: "bg-info", text: "Preparing" },
      served: { class: "bg-success", text: "Served" },
      cancelled: { class: "bg-danger", text: "Cancelled" },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status,
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getPaymentBadge = (isPaid) => {
    return isPaid ? (
      <span className="badge bg-success">Paid</span>
    ) : (
      <span className="badge bg-warning">Pending</span>
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text(
      `Order Summary - ${restaurant?.restaurantName || "Restaurant"}`,
      14,
      15
    );

    // Date Range
    doc.setFontSize(10);
    doc.text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, 14, 25);

    // Summary Table
    doc.autoTable({
      startY: 35,
      head: [["Metric", "Value"]],
      body: [
        ["Total Orders", summary.totalOrders],
        ["Served Orders", summary.servedOrders],
        ["Cancelled Orders", summary.cancelledOrders],
        ["Total Revenue", `₹${summary.totalRevenue.toLocaleString()}`],
        ["Average Order Value", `₹${summary.averageOrderValue.toFixed(2)}`],
      ],
      theme: "grid",
    });

    // Orders Table
    const ordersData = filteredOrders.map((order) => [
      `#${order._id?.slice(-6) || "N/A"}`,
      new Date(order.createdAt).toLocaleDateString(),
      new Date(order.createdAt).toLocaleTimeString(),
      order.tableNumber || order.table || "N/A",
      order.status,
      order.isPaid ? "Paid" : "Pending",
      `₹${(order.totalPrice || order.total || 0).toLocaleString()}`,
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [
        ["Order ID", "Date", "Time", "Table", "Status", "Payment", "Amount"],
      ],
      body: ordersData,
      theme: "grid",
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    doc.save(
      `order-summary-${dateRange.startDate}-to-${dateRange.endDate}.pdf`
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Date",
      "Time",
      "Table",
      "Customer",
      "Status",
      "Payment",
      "Amount",
      "Items",
    ];

    const csvData = filteredOrders.map((order) => [
      order._id || "N/A",
      new Date(order.createdAt).toLocaleDateString(),
      new Date(order.createdAt).toLocaleTimeString(),
      order.tableNumber || order.table || "N/A",
      order.userId?.name || "Guest",
      order.status,
      order.isPaid ? "Paid" : "Pending",
      order.totalPrice || order.total || 0,
      order.menuItems
        ?.map((item) => `${item.quantity}x ${item.name}`)
        .join("; ") || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-0">Order History</h2>
          <p className="text-muted">Complete order statements and analytics</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6 className="card-title">Total Orders</h6>
              <h3 className="mb-0">{summary.totalOrders}</h3>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6 className="card-title">Served</h6>
              <h3 className="mb-0">{summary.servedOrders}</h3>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h6 className="card-title">Cancelled</h6>
              <h3 className="mb-0">{summary.cancelledOrders}</h3>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 col-sm-6 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h6 className="card-title">Total Revenue</h6>
              <h3 className="mb-0">₹{summary.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 col-sm-6 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6 className="card-title">Avg Order Value</h6>
              <h3 className="mb-0">₹{summary.averageOrderValue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-control"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">To Date</label>
          <input
            type="date"
            className="form-control"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>
        <div className="col-md-4 d-flex align-items-end gap-2">
          <button
            className="btn btn-success"
            onClick={exportToPDF}
            disabled={filteredOrders.length === 0}
          >
            📄 Export PDF
          </button>
          <button
            className="btn btn-outline-success"
            onClick={exportToCSV}
            disabled={filteredOrders.length === 0}
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            Order Statements ({filteredOrders.length} records)
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Date & Time</th>
                  <th>Table</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        No orders found for selected period
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong>#{order._id?.slice(-6) || "N/A"}</strong>
                      </td>
                      <td>
                        <div>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>T-{order.tableNumber || order.table || "N/A"}</td>
                      <td>{order.userId?.name || "Guest"}</td>
                      <td>
                        <small>
                          {order.menuItems
                            ?.slice(0, 2)
                            .map((item) => `${item.quantity}x ${item.name}`)
                            .join(", ")}
                          {order.menuItems?.length > 2 && (
                            <span className="text-primary">
                              {" "}
                              +{order.menuItems.length - 2} more
                            </span>
                          )}
                        </small>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{getPaymentBadge(order.isPaid)}</td>
                      <td className="text-end">
                        <strong
                          className={
                            order.status === "served"
                              ? "text-success"
                              : "text-muted"
                          }
                        >
                          ₹
                          {(
                            order.totalPrice ||
                            order.total ||
                            0
                          ).toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Date Presets */}
      <div className="row mt-3">
        <div className="col">
          <div className="d-flex gap-2 flex-wrap">
            <small className="text-muted me-2">Quick filters:</small>
            {[
              { label: "Today", days: 0 },
              { label: "Last 7 Days", days: 7 },
              { label: "Last 30 Days", days: 30 },
              { label: "This Month", days: "month" },
            ].map((preset) => (
              <button
                key={preset.label}
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  const end = new Date();
                  let start = new Date();

                  if (preset.days === "month") {
                    start = new Date(end.getFullYear(), end.getMonth(), 1);
                  } else {
                    start.setDate(end.getDate() - preset.days);
                  }

                  setDateRange({
                    startDate: start.toISOString().split("T")[0],
                    endDate: end.toISOString().split("T")[0],
                  });
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalOrders;
