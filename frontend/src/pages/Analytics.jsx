import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('today'); // today, week, month, year
  const [activeTab, setActiveTab] = useState('overview'); // overview, sales, orders, customers

  // Mock data - in real app, this would come from API
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalRevenue: 125000,
      totalOrders: 845,
      averageOrderValue: 1480,
      customerSatisfaction: 4.7,
      revenueChange: 12.5,
      ordersChange: 8.3,
      aovChange: 3.8,
      satisfactionChange: 0.2
    },
    sales: {
      daily: [
        { date: 'Mon', revenue: 18500, orders: 125 },
        { date: 'Tue', revenue: 22000, orders: 148 },
        { date: 'Wed', revenue: 19500, orders: 132 },
        { date: 'Thu', revenue: 24000, orders: 158 },
        { date: 'Fri', revenue: 28500, orders: 185 },
        { date: 'Sat', revenue: 32000, orders: 210 },
        { date: 'Sun', revenue: 18000, orders: 122 }
      ],
      categories: [
        { name: 'Main Course', revenue: 65000, percentage: 52 },
        { name: 'Starters', revenue: 25000, percentage: 20 },
        { name: 'Beverages', revenue: 18000, percentage: 14.4 },
        { name: 'Desserts', revenue: 12000, percentage: 9.6 },
        { name: 'Others', revenue: 5000, percentage: 4 }
      ]
    },
    orders: {
      status: {
        completed: 720,
        pending: 45,
        cancelled: 25,
        preparing: 55
      },
      peakHours: [
        { hour: '12-1 PM', orders: 85 },
        { hour: '1-2 PM', orders: 92 },
        { hour: '7-8 PM', orders: 105 },
        { hour: '8-9 PM', orders: 98 },
        { hour: '6-7 PM', orders: 88 }
      ],
      popularItems: [
        { name: 'Paneer Butter Masala', orders: 156, revenue: 39000 },
        { name: 'Chicken Tikka', orders: 142, revenue: 42600 },
        { name: 'Butter Naan', orders: 298, revenue: 14900 },
        { name: 'Biryani', orders: 134, revenue: 32160 },
        { name: 'Masala Dosa', orders: 128, revenue: 25600 }
      ]
    },
    customers: {
      totalCustomers: 625,
      newCustomers: 45,
      returningCustomers: 580,
      averageVisitFrequency: 3.2,
      customerGrowth: 15.8,
      feedback: [
        { rating: 5, count: 420, percentage: 67.2 },
        { rating: 4, count: 158, percentage: 25.3 },
        { rating: 3, count: 32, percentage: 5.1 },
        { rating: 2, count: 10, percentage: 1.6 },
        { rating: 1, count: 5, percentage: 0.8 }
      ]
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success' : 'text-danger';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  // Simple bar chart component for revenue
  const RevenueChart = ({ data }) => {
    const maxRevenue = Math.max(...data.map(item => item.revenue));
    
    return (
      <div className="revenue-chart">
        <div className="d-flex justify-content-between align-items-end" style={{ height: '200px' }}>
          {data.map((day, index) => (
            <div key={index} className="d-flex flex-column align-items-center" style={{ width: '14%' }}>
              <div 
                className="bg-primary rounded-top"
                style={{ 
                  height: `${(day.revenue / maxRevenue) * 150}px`,
                  width: '30px',
                  transition: 'height 0.3s ease'
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
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'];
    
    return (
      <div className="category-chart">
        {data.map((category, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small">
                <span 
                  className="d-inline-block rounded-circle me-2"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: colors[index % colors.length]
                  }}
                ></span>
                {category.name}
              </span>
              <span className="small fw-bold">{formatCurrency(category.revenue)}</span>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              ></div>
            </div>
            <div className="d-flex justify-content-between">
              <small className="text-muted">{category.percentage}%</small>
              <small className="text-muted">{formatNumber(category.revenue)}</small>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Analytics Dashboard</h2>
              <p className="text-muted mb-0">Monitor your restaurant performance and key metrics</p>
            </div>
            <div className="btn-group">
              <button
                className={`btn btn-outline-secondary ${timeRange === 'today' ? 'active' : ''}`}
                onClick={() => setTimeRange('today')}
              >
                Today
              </button>
              <button
                className={`btn btn-outline-secondary ${timeRange === 'week' ? 'active' : ''}`}
                onClick={() => setTimeRange('week')}
              >
                This Week
              </button>
              <button
                className={`btn btn-outline-secondary ${timeRange === 'month' ? 'active' : ''}`}
                onClick={() => setTimeRange('month')}
              >
                This Month
              </button>
              <button
                className={`btn btn-outline-secondary ${timeRange === 'year' ? 'active' : ''}`}
                onClick={() => setTimeRange('year')}
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`}
                onClick={() => setActiveTab('sales')}
              >
                <i className="bi bi-graph-up me-2"></i>
                Sales
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="bi bi-cart me-2"></i>
                Orders
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveTab('customers')}
              >
                <i className="bi bi-people me-2"></i>
                Customers
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
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
                      <span className={`badge ${getChangeColor(analyticsData.overview.revenueChange)}`}>
                        <i className={`bi ${getChangeIcon(analyticsData.overview.revenueChange)} me-1`}></i>
                        {Math.abs(analyticsData.overview.revenueChange)}%
                      </span>
                      <small className="text-muted ms-2">vs previous period</small>
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
                      <span className={`badge ${getChangeColor(analyticsData.overview.ordersChange)}`}>
                        <i className={`bi ${getChangeIcon(analyticsData.overview.ordersChange)} me-1`}></i>
                        {Math.abs(analyticsData.overview.ordersChange)}%
                      </span>
                      <small className="text-muted ms-2">vs previous period</small>
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
                      <span className={`badge ${getChangeColor(analyticsData.overview.aovChange)}`}>
                        <i className={`bi ${getChangeIcon(analyticsData.overview.aovChange)} me-1`}></i>
                        {Math.abs(analyticsData.overview.aovChange)}%
                      </span>
                      <small className="text-muted ms-2">vs previous period</small>
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
                      <span className={`badge ${getChangeColor(analyticsData.overview.satisfactionChange)}`}>
                        <i className={`bi ${getChangeIcon(analyticsData.overview.satisfactionChange)} me-1`}></i>
                        {Math.abs(analyticsData.overview.satisfactionChange)}
                      </span>
                      <small className="text-muted ms-2">vs previous period</small>
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
                <h6 className="m-0 font-weight-bold text-primary">Revenue Trend</h6>
              </div>
              <div className="card-body">
                <RevenueChart data={analyticsData.sales.daily} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Sales by Category</h6>
              </div>
              <div className="card-body">
                <CategoryChart data={analyticsData.sales.categories} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Daily Revenue</h6>
              </div>
              <div className="card-body">
                <RevenueChart data={analyticsData.sales.daily} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Revenue Distribution</h6>
              </div>
              <div className="card-body">
                <CategoryChart data={analyticsData.sales.categories} />
              </div>
            </div>
          </div>

          {/* Sales Details */}
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Sales Details</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Revenue</th>
                        <th>Orders</th>
                        <th>Avg Order Value</th>
                        <th>Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.sales.daily.map((day, index) => (
                        <tr key={index}>
                          <td>{day.date}</td>
                          <td>{formatCurrency(day.revenue)}</td>
                          <td>{formatNumber(day.orders)}</td>
                          <td>{formatCurrency(day.revenue / day.orders)}</td>
                          <td>
                            <span className="badge bg-success">
                              <i className="bi bi-arrow-up me-1"></i>
                              {Math.floor(Math.random() * 20) + 5}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="row">
          {/* Order Status Cards */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">{analyticsData.orders.status.completed}</h4>
                    <small>Completed</small>
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
                    <h4 className="mb-0">{analyticsData.orders.status.pending}</h4>
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
                    <h4 className="mb-0">{analyticsData.orders.status.preparing}</h4>
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
                    <h4 className="mb-0">{analyticsData.orders.status.cancelled}</h4>
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
                <h6 className="m-0 font-weight-bold text-primary">Peak Order Hours</h6>
              </div>
              <div className="card-body">
                {analyticsData.orders.peakHours.map((hour, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>{hour.hour}</span>
                      <span className="fw-bold">{hour.orders} orders</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${(hour.orders / 105) * 100}%` }}
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
                <h6 className="m-0 font-weight-bold text-primary">Most Popular Items</h6>
              </div>
              <div className="card-body">
                {analyticsData.orders.popularItems.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
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
      {activeTab === 'customers' && (
        <div className="row">
          {/* Customer Metrics */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">{formatNumber(analyticsData.customers.totalCustomers)}</h4>
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
                    <h4 className="mb-0">{analyticsData.customers.newCustomers}</h4>
                    <small>New Customers</small>
                  </div>
                  <i className="bi bi-person-plus fs-2"></i>
                </div>
                <div className="mt-2">
                  <small>This week</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="mb-0">{analyticsData.customers.averageVisitFrequency}</h4>
                    <small>Avg Visits/Customer</small>
                  </div>
                  <i className="bi bi-graph-up fs-2"></i>
                </div>
                <div className="mt-2">
                  <small>Per month</small>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Feedback */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Customer Ratings</h6>
              </div>
              <div className="card-body">
                {analyticsData.customers.feedback.map((rating, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>
                        {Array.from({ length: 5 }, (_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < 5 - index ? '-fill' : ''} ${i < 5 - index ? 'text-warning' : 'text-muted'}`}
                          ></i>
                        ))}
                      </span>
                      <span className="fw-bold">{rating.count} ratings</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">{rating.percentage}%</small>
                      <small className="text-muted">{rating.count} customers</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Type Distribution */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Customer Distribution</h6>
              </div>
              <div className="card-body">
                <div className="text-center">
                  <div className="d-flex justify-content-around mb-4">
                    <div className="text-center">
                      <div className="fs-2 text-primary">{analyticsData.customers.returningCustomers}</div>
                      <small className="text-muted">Returning Customers</small>
                    </div>
                    <div className="text-center">
                      <div className="fs-2 text-success">{analyticsData.customers.newCustomers}</div>
                      <small className="text-muted">New Customers</small>
                    </div>
                  </div>
                  <div className="progress" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ 
                        width: `${(analyticsData.customers.returningCustomers / analyticsData.customers.totalCustomers) * 100}%` 
                      }}
                    >
                      {Math.round((analyticsData.customers.returningCustomers / analyticsData.customers.totalCustomers) * 100)}%
                    </div>
                    <div
                      className="progress-bar bg-success"
                      style={{ 
                        width: `${(analyticsData.customers.newCustomers / analyticsData.customers.totalCustomers) * 100}%` 
                      }}
                    >
                      {Math.round((analyticsData.customers.newCustomers / analyticsData.customers.totalCustomers) * 100)}%
                    </div>
                  </div>
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