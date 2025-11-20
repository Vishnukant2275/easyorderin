import React, { useState, useEffect } from "react";
import { useRestaurant } from "../../context/RestaurantContext";
import api from "../../services ";

const Analytics = () => {
  const { orders, menuItems } = useRestaurant();
  const [timeRange, setTimeRange] = useState("today"); // today, week, month, year
  const [activeTab, setActiveTab] = useState("overview"); // overview, sales, orders, customers
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders for analytics
  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/restaurant/orders/all");
      if (response.data.success) {
        setAllOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders for analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data from real orders
  const calculateAnalyticsData = () => {
    const servedOrders = allOrders.filter((order) => order.status === "served");
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    // Filter orders based on time range
    const filteredOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      switch (timeRange) {
        case "today":
          return orderDate >= todayStart && orderDate <= todayEnd;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case "month":
          const monthAgo = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate()
          );
          return orderDate >= monthAgo;
        case "year":
          const yearAgo = new Date(
            today.getFullYear() - 1,
            today.getMonth(),
            today.getDate()
          );
          return orderDate >= yearAgo;
        default:
          return true;
      }
    });

    const filteredServedOrders = filteredOrders.filter(
      (order) => order.status === "served"
    );

    // Calculate metrics
    const totalRevenue = filteredServedOrders.reduce(
      (sum, order) => sum + (order.totalPrice || order.total || 0),
      0
    );
    const totalOrders = filteredOrders.length;
    const averageOrderValue =
      filteredServedOrders.length > 0
        ? totalRevenue / filteredServedOrders.length
        : 0;

    // Calculate changes (mock data for demonstration)
    const revenueChange = 12.5; // In real app, compare with previous period
    const ordersChange = 8.3;
    const aovChange = 3.8;

    // Sales by category
    const categoryRevenue = {};
    filteredServedOrders.forEach((order) => {
      order.menuItems?.forEach((item) => {
        const category = getItemCategory(item.menuId);
        const revenue = (item.quantity || 1) * (item.price || 0);
        categoryRevenue[category] = (categoryRevenue[category] || 0) + revenue;
      });
    });

    const totalCategoryRevenue = Object.values(categoryRevenue).reduce(
      (sum, revenue) => sum + revenue,
      0
    );
    const categories = Object.entries(categoryRevenue)
      .map(([name, revenue]) => ({
        name,
        revenue,
        percentage:
          totalCategoryRevenue > 0 ? (revenue / totalCategoryRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Order status breakdown
    const orderStatus = {
      served: filteredOrders.filter((order) => order.status === "served")
        .length,
      pending: filteredOrders.filter((order) => order.status === "pending")
        .length,
      preparing: filteredOrders.filter((order) => order.status === "preparing")
        .length,
      cancelled: filteredOrders.filter((order) => order.status === "cancelled")
        .length,
    };

    // Peak hours analysis
    const hourCounts = {};
    filteredOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      const hourKey = `${hour}:00-${hour + 1}:00`;
      hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
    });

    const peakHours = Object.entries(hourCounts)
      .map(([hour, orders]) => ({ hour, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    // Popular items
    const itemPopularity = {};
    filteredOrders.forEach((order) => {
      order.menuItems?.forEach((item) => {
        const itemName = getItemName(item.menuId) || "Unknown Item";
        itemPopularity[itemName] = itemPopularity[itemName] || {
          orders: 0,
          revenue: 0,
        };
        itemPopularity[itemName].orders += item.quantity || 1;
        itemPopularity[itemName].revenue +=
          (item.quantity || 1) * (item.price || 0);
      });
    });

    const popularItems = Object.entries(itemPopularity)
      .map(([name, data]) => ({
        name,
        orders: data.orders,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    // Customer analytics (mock data for now)
    const totalCustomers = new Set(
      filteredOrders.map((order) => order.userId?._id)
    ).size;
    const newCustomers = Math.floor(totalCustomers * 0.15); // Mock new customers
    const returningCustomers = totalCustomers - newCustomers;

    return {
      overview: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        customerSatisfaction: 4.7, // Mock data
        revenueChange,
        ordersChange,
        aovChange,
        satisfactionChange: 0.2,
      },
      sales: {
        daily: generateDailyData(filteredServedOrders), // Generate daily breakdown
        categories,
      },
      orders: {
        status: orderStatus,
        peakHours,
        popularItems,
      },
      customers: {
        totalCustomers,
        newCustomers,
        returningCustomers,
        averageVisitFrequency: 2.8, // Mock data
        customerGrowth: 15.8, // Mock data
        feedback: [
          {
            rating: 5,
            count: Math.floor(totalCustomers * 0.67),
            percentage: 67,
          },
          {
            rating: 4,
            count: Math.floor(totalCustomers * 0.25),
            percentage: 25,
          },
          {
            rating: 3,
            count: Math.floor(totalCustomers * 0.05),
            percentage: 5,
          },
          {
            rating: 2,
            count: Math.floor(totalCustomers * 0.02),
            percentage: 2,
          },
          {
            rating: 1,
            count: Math.floor(totalCustomers * 0.01),
            percentage: 1,
          },
        ],
      },
    };
  };

  // Helper function to get item category
  const getItemCategory = (menuId) => {
    const menuItem = menuItems?.find((item) => item._id === menuId);
    return menuItem?.category || "Uncategorized";
  };

  // Helper function to get item name
  const getItemName = (menuId) => {
    const menuItem = menuItems?.find((item) => item._id === menuId);
    return menuItem?.name;
  };

  // Generate daily revenue data
  const generateDailyData = (orders) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyData = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dayKey = days[date.getDay()];
      dailyData[dayKey] =
        (dailyData[dayKey] || 0) + (order.totalPrice || order.total || 0);
    });

    return days.map((day) => ({
      date: day,
      revenue: dailyData[day] || 0,
      orders: orders.filter(
        (order) => days[new Date(order.createdAt).getDay()] === day
      ).length,
    }));
  };

  const analyticsData = calculateAnalyticsData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? "text-success" : "text-danger";
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? "bi-arrow-up" : "bi-arrow-down";
  };

  // Simple bar chart component for revenue
  const RevenueChart = ({ data }) => {
    const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

    return (
      <div className="revenue-chart">
        <div
          className="d-flex justify-content-between align-items-end"
          style={{ height: "200px" }}
        >
          {data.map((day, index) => (
            <div
              key={index}
              className="d-flex flex-column align-items-center"
              style={{ width: "14%" }}
            >
              <div
                className="bg-primary rounded-top"
                style={{
                  height: `${(day.revenue / maxRevenue) * 150}px`,
                  width: "30px",
                  transition: "height 0.3s ease",
                }}
                title={`${day.date}: ${formatCurrency(day.revenue)}`}
              ></div>
              <small className="mt-2 text-muted">{day.date}</small>
              <small className="fw-bold">{formatCurrency(day.revenue)}</small>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Pie chart for categories
  const CategoryChart = ({ data }) => {
    const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

    return (
      <div className="category-chart">
        {data.slice(0, 5).map((category, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small">
                <span
                  className="d-inline-block rounded-circle me-2"
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: colors[index % colors.length],
                  }}
                ></span>
                {category.name}
              </span>
              <span className="small fw-bold">
                {formatCurrency(category.revenue)}
              </span>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: colors[index % colors.length],
                }}
              ></div>
            </div>
            <div className="d-flex justify-content-between">
              <small className="text-muted">
                {category.percentage.toFixed(1)}%
              </small>
              <small className="text-muted">
                {formatNumber(category.revenue)}
              </small>
            </div>
          </div>
        ))}
      </div>
    );
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
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Analytics Dashboard</h2>
              <p className="text-muted mb-0">
                Monitor your restaurant performance and key metrics
              </p>
            </div>
            <div className="btn-group">
              {["today", "week", "month", "year"].map((range) => (
                <button
                  key={range}
                  className={`btn btn-outline-secondary ${
                    timeRange === range ? "active" : ""
                  }`}
                  onClick={() => setTimeRange(range)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills">
            {[
              { key: "overview", icon: "bi-speedometer2", label: "Overview" },
              { key: "sales", icon: "bi-graph-up", label: "Sales" },
              { key: "orders", icon: "bi-cart", label: "Orders" },
              { key: "customers", icon: "bi-people", label: "Customers" },
            ].map((tab) => (
              <li key={tab.key} className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === tab.key ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <i className={`${tab.icon} me-2`}></i>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="row">
          {/* Key Metrics */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Revenue
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {formatCurrency(analyticsData.overview.totalRevenue)}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`badge ${getChangeColor(
                          analyticsData.overview.revenueChange
                        )}`}
                      >
                        <i
                          className={`bi ${getChangeIcon(
                            analyticsData.overview.revenueChange
                          )} me-1`}
                        ></i>
                        {Math.abs(analyticsData.overview.revenueChange)}%
                      </span>
                      <small className="text-muted ms-2">
                        vs previous period
                      </small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-currency-rupee fs-1 text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Total Orders
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {formatNumber(analyticsData.overview.totalOrders)}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`badge ${getChangeColor(
                          analyticsData.overview.ordersChange
                        )}`}
                      >
                        <i
                          className={`bi ${getChangeIcon(
                            analyticsData.overview.ordersChange
                          )} me-1`}
                        ></i>
                        {Math.abs(analyticsData.overview.ordersChange)}%
                      </span>
                      <small className="text-muted ms-2">
                        vs previous period
                      </small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-cart-check fs-1 text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Avg Order Value
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {formatCurrency(analyticsData.overview.averageOrderValue)}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`badge ${getChangeColor(
                          analyticsData.overview.aovChange
                        )}`}
                      >
                        <i
                          className={`bi ${getChangeIcon(
                            analyticsData.overview.aovChange
                          )} me-1`}
                        ></i>
                        {Math.abs(analyticsData.overview.aovChange)}%
                      </span>
                      <small className="text-muted ms-2">
                        vs previous period
                      </small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-graph-up fs-1 text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Customer Satisfaction
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {analyticsData.overview.customerSatisfaction}/5
                    </div>
                    <div className="mt-2">
                      <span
                        className={`badge ${getChangeColor(
                          analyticsData.overview.satisfactionChange
                        )}`}
                      >
                        <i
                          className={`bi ${getChangeIcon(
                            analyticsData.overview.satisfactionChange
                          )} me-1`}
                        ></i>
                        {Math.abs(analyticsData.overview.satisfactionChange)}
                      </span>
                      <small className="text-muted ms-2">
                        vs previous period
                      </small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-star fs-1 text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Revenue Trend -{" "}
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </h6>
              </div>
              <div className="card-body">
                <RevenueChart data={analyticsData.sales.daily} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Sales by Category
                </h6>
              </div>
              <div className="card-body">
                <CategoryChart data={analyticsData.sales.categories} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Revenue Trend
                </h6>
              </div>
              <div className="card-body">
                <RevenueChart data={analyticsData.sales.daily} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Revenue Distribution
                </h6>
              </div>
              <div className="card-body">
                <CategoryChart data={analyticsData.sales.categories} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="row">
          {/* Order Status Cards */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">
                      {analyticsData.orders.status.served}
                    </h4>
                    <small>Served</small>
                  </div>
                  <i className="bi bi-check-circle fs-2"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">
                      {analyticsData.orders.status.pending}
                    </h4>
                    <small>Pending</small>
                  </div>
                  <i className="bi bi-clock fs-2"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">
                      {analyticsData.orders.status.preparing}
                    </h4>
                    <small>Preparing</small>
                  </div>
                  <i className="bi bi-egg-fried fs-2"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card bg-danger text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">
                      {analyticsData.orders.status.cancelled}
                    </h4>
                    <small>Cancelled</small>
                  </div>
                  <i className="bi bi-x-circle fs-2"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Peak Order Hours
                </h6>
              </div>
              <div className="card-body">
                {analyticsData.orders.peakHours.map((hour, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>{hour.hour}</span>
                      <span className="fw-bold">{hour.orders} orders</span>
                    </div>
                    <div className="progress" style={{ height: "10px" }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{
                          width: `${
                            (hour.orders /
                              Math.max(
                                ...analyticsData.orders.peakHours.map(
                                  (h) => h.orders
                                )
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Items */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Most Popular Items
                </h6>
              </div>
              <div className="card-body">
                {analyticsData.orders.popularItems.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded"
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <br />
                      <small className="text-muted">{item.orders} orders</small>
                    </div>
                    <div className="text-end">
                      <strong>{formatCurrency(item.revenue)}</strong>
                      <br />
                      <small className="text-muted">Revenue</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <div className="row">
          {/* Customer Metrics */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">
                      {formatNumber(analyticsData.customers.totalCustomers)}
                    </h4>
                    <small>Total Customers</small>
                  </div>
                  <i className="bi bi-people fs-2"></i>
                </div>
                <div className="mt-2">
                  <span className="badge bg-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    {analyticsData.customers.customerGrowth}%
                  </span>
                  <small className="ms-2">growth this month</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">
                      {analyticsData.customers.newCustomers}
                    </h4>
                    <small>New Customers</small>
                  </div>
                  <i className="bi bi-person-plus fs-2"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">
                      {analyticsData.customers.averageVisitFrequency}
                    </h4>
                    <small>Avg Visits/Customer</small>
                  </div>
                  <i className="bi bi-graph-up fs-2"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
