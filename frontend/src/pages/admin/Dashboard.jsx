import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import styles from './Dashboard.module.css';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const { getDashboardStats, admin } = useAdmin();
  const [stats, setStats] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboardStats();
      
      if (result.success) {
        setDashboardData(result.data);
        
        // Transform API data to match our card structure
        const transformedStats = [
          { 
            title: 'Total Restaurants', 
            value: result.data.totalRestaurants?.toString() || '0', 
            change: calculateChange(result.data.totalRestaurants, result.data.previousTotalRestaurants),
            icon: '🏪', 
            color: '#667eea', 
            link: '/admin/restaurants'
          },
          { 
            title: 'Active Orders', 
            value: result.data.pendingOrders?.toString() || '0', 
            change: calculateChange(result.data.pendingOrders, result.data.previousPendingOrders),
            icon: '📦', 
            color: '#764ba2' , 
            link: '/admin/orders'
          },
          { 
            title: 'Total Revenue', 
            value: `₹${(result.data.totalRevenue || 0).toLocaleString('en-IN')}`, 
            change: calculateChange(result.data.totalRevenue, result.data.previousTotalRevenue),
            icon: '💰', 
            color: '#f093fb' 
            , 
            link: '/admin/revenue'
          },
          { 
            title: 'Total Users', 
            value: result.data.totalUsers?.toString() || '0', 
            change: calculateChange(result.data.totalUsers, result.data.previousTotalUsers),
            icon: '👥', 
            color: '#4facfe' , 
            link: '/admin/users'
          },
          { 
            title: 'Completed Orders', 
            value: result.data.completedOrders?.toString() || '0', 
            change: calculateChange(result.data.completedOrders, result.data.previousCompletedOrders),
            icon: '🍽️', 
            color: '#43e97b' 
          },
          { 
            title: 'Active Restaurants', 
            value: result.data.activeRestaurants?.toString() || '0', 
            change: calculateChange(result.data.activeRestaurants, result.data.previousActiveRestaurants),
            icon: '⭐', 
            color: '#fa709a' , 
            link: '/admin/restaurants'
          }
        ];
        
        setStats(transformedStats);
      } else {
        setError(result.message);
        // Fallback to sample data if API fails
        setStats(getSampleStats());
      }
    } catch (err) {
      console.error('Dashboard data loading error:', err);
      setError('Failed to load dashboard data');
      // Fallback to sample data
      setStats(getSampleStats());
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return '+0%';
    
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${Math.abs(change).toFixed(1)}%`;
  };

  const getSampleStats = () => [
    { title: 'Total Restaurants', value: '0', change: '+0%', icon: '🏪', color: '#667eea' },
    { title: 'Active Orders', value: '0', change: '+0%', icon: '📦', color: '#764ba2' },
    { title: 'Total Revenue', value: '₹0', change: '+0%', icon: '💰', color: '#f093fb' },
    { title: 'Total Users', value: '0', change: '+0%', icon: '👥', color: '#4facfe' },
    { title: 'Completed Orders', value: '0', change: '+0%', icon: '🍽️', color: '#43e97b' },
    { title: 'Active Restaurants', value: '0', change: '+0%', icon: '⭐', color: '#fa709a' }
  ];

  // Generate real recent activities from dashboard data
  const getRecentActivities = () => {
    if (!dashboardData?.recentActivities) {
      return [
        { id: 1, activity: 'No recent activities', time: 'Just now', type: 'info' }
      ];
    }

    return dashboardData.recentActivities.map((activity, index) => ({
      id: index + 1,
      activity: activity.description || 'Activity',
      time: formatTime(activity.timestamp),
      type: activity.type || 'info'
    }));
  };

  // Generate real top restaurants from dashboard data
  const getTopRestaurants = () => {
    if (!dashboardData?.topRestaurants) {
      return [
        { name: 'No restaurant data', orders: 0, revenue: '₹0', rating: 0.0 }
      ];
    }

    return dashboardData.topRestaurants.map(restaurant => ({
      name: restaurant.name || 'Unknown Restaurant',
      orders: restaurant.totalOrders || 0,
      revenue: `₹${(restaurant.totalRevenue || 0).toLocaleString('en-IN')}`,
      rating: restaurant.averageRating || 0.0
    }));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleRefresh = async () => {
    await loadDashboardData();
  };

  const handleQuickAction = (action) => {
    // Implement quick action handlers based on your routing
    switch(action) {
      case 'add-restaurant':
        window.location.href = '/admin/restaurants?action=add';
        break;
      case 'generate-report':
        window.location.href = '/admin/analytics';
        break;
      case 'create-invoice':
        window.location.href = '/admin/invoices';
        break;
      case 'manage-users':
        window.location.href = '/admin/users';
        break;
      default:
        console.log('Action:', action);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
          <p className={styles.dashboardSubtitle}>Overview of your restaurant platform</p>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const recentActivities = getRecentActivities();
  const topRestaurants = getTopRestaurants();

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.dashboardTitle}>
              Welcome back, {admin?.name || 'Admin'}! 👋
            </h1>
            <p className={styles.dashboardSubtitle}>
              {dashboardData ? 
                `Platform overview as of ${new Date().toLocaleTimeString('en-IN')}` : 
                'Here\'s what\'s happening with your restaurant platform today'
              }
            </p>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.refreshBtn}
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
            <div className={styles.currentTime}>
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
         <Link to={stat.link} style={{ textDecoration: "none", color: "inherit" }}><div key={index} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
            <div className={styles.statChange}>
              <span className={styles.changeText}>{stat.change}</span>
            </div>
          </div></Link>
        ))}
      </div>

      <div className={styles.dashboardContent}>
        {/* Recent Activities */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Activities</h2>
            <div className={styles.sectionActions}>
              <span className={styles.sectionBadge}>{recentActivities.length} activities</span>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
          </div>
          <div className={styles.activitiesList}>
            {recentActivities.map(activity => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {activity.type === 'restaurant' && '🏪'}
                  {activity.type === 'order' && '📦'}
                  {activity.type === 'user' && '👤'}
                  {activity.type === 'payment' && '💰'}
                  {activity.type === 'menu' && '🍽️'}
                  {activity.type === 'info' && 'ℹ️'}
                </div>
                <div className={styles.activityDetails}>
                  <p className={styles.activityText}>{activity.activity}</p>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
                <div className={styles.activityAction}>
                  <button className={styles.actionBtn}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Restaurants */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top Performing Restaurants</h2>
            <div className={styles.sectionActions}>
              <span className={styles.sectionBadge}>{topRestaurants.length} restaurants</span>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
          </div>
          <div className={styles.restaurantsList}>
            {topRestaurants.map((restaurant, index) => (
              <div key={index} className={styles.restaurantItem}>
                <div className={styles.restaurantInfo}>
                  <div className={styles.restaurantHeader}>
                    <h4 className={styles.restaurantName}>{restaurant.name}</h4>
                    {restaurant.rating > 0 && (
                      <span className={styles.ratingBadge}>⭐ {restaurant.rating.toFixed(1)}</span>
                    )}
                  </div>
                  <div className={styles.restaurantStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Orders</span>
                      <span className={styles.statValue}>{restaurant.orders.toLocaleString()}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Revenue</span>
                      <span className={styles.statValue}>{restaurant.revenue}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.restaurantActions}>
                  <button className={styles.viewBtn}>View Details</button>
                  <button className={styles.analyticsBtn}>Analytics</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.actionsTitle}>Quick Actions</h3>
        <div className={styles.actionsGrid}>
          <button 
            className={styles.actionCard}
            onClick={() => handleQuickAction('add-restaurant')}
          >
            <span className={styles.actionIcon}>🏪</span>
            <span className={styles.actionText}>Add Restaurant</span>
          </button>
          <button 
            className={styles.actionCard}
            onClick={() => handleQuickAction('generate-report')}
          >
            <span className={styles.actionIcon}>📊</span>
            <span className={styles.actionText}>Generate Report</span>
          </button>
          <button 
            className={styles.actionCard}
            onClick={() => handleQuickAction('create-invoice')}
          >
            <span className={styles.actionIcon}>🧾</span>
            <span className={styles.actionText}>Create Invoice</span>
          </button>
          <button 
            className={styles.actionCard}
            onClick={() => handleQuickAction('manage-users')}
          >
            <span className={styles.actionIcon}>👥</span>
            <span className={styles.actionText}>Manage Users</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;