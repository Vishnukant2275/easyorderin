import React from 'react';
import './AdminFooter.css';
import { useRestaurant } from '../../context/AdminRestaurantContext';
import { useAdminUser } from '../../context/AdminUserContext';
import { useAdmin } from '../../context/AdminContext';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();
  const { activeRestaurants, restaurants, loading: restaurantsLoading } = useRestaurant();
  const { totalUsers, activeUsers, loading: usersLoading } = useAdminUser();
  const { admin, getDashboardStats, loading: adminLoading } = useAdmin();

  // State for dynamic stats
  const [stats, setStats] = React.useState([
    { label: 'Active Restaurants', value: '0', trend: '+0' },
    { label: 'Pending Orders', value: '0', trend: '+0' },
    { label: 'Total Revenue', value: '₹0', trend: '+0%' },
  ]);

  const [loading, setLoading] = React.useState(true);

  // Fetch dashboard stats on component mount
  React.useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true);
        const result = await getDashboardStats();
        
        if (result.success) {
          const dashboardData = result.data;
          
          setStats([
            { 
              label: 'Active Restaurants', 
              value: (activeRestaurants?.length || 0).toString(), 
              trend: `+${Math.max(0, (activeRestaurants?.length || 0) - (dashboardData.previousActiveRestaurants || 0))}` 
            },
            { 
              label: 'Pending Orders', 
              value: (dashboardData.pendingOrders?.toString() || '0'), 
              trend: `+${dashboardData.newOrdersToday?.toString() || '0'}` 
            },
            { 
              label: 'Total Revenue', 
              value: `₹${formatCurrency(dashboardData.totalRevenue || 0)}`, 
              trend: `+${dashboardData.revenueGrowth || '0'}%` 
            },
          ]);
        } else {
          // Fallback to context data if API fails
          setStats(getFallbackStats());
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Fallback to context data if API fails
        setStats(getFallbackStats());
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, [activeRestaurants, totalUsers, restaurants, activeUsers, getDashboardStats]);

  // Format currency helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount || 0);
  };

  // Get fallback stats when API fails
  const getFallbackStats = () => {
    return [
      { 
        label: 'Active Restaurants', 
        value: (activeRestaurants?.length || 0).toString(), 
        trend: `+${activeRestaurants?.length || 0}` 
      },
      { 
        label: 'Total Users', 
        value: (totalUsers || 0).toString(), 
        trend: `+${activeUsers?.length || 0}` 
      },
      { 
        label: 'All Restaurants', 
        value: (restaurants?.length || 0).toString(), 
        trend: '+0' 
      },
    ];
  };

  const quickLinks = [
    { name: 'Support', path: '/admin/support' },
    { name: 'Documentation', path: '/admin/docs' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  // Get system status based on context data
  const getSystemStatus = () => {
    const restaurantsCount = restaurants?.length || 0;
    const usersCount = totalUsers || 0;
    
    if (restaurantsCount === 0 && usersCount === 0) {
      return { status: 'initializing', text: 'System Initializing', class: 'initializing' };
    }
    if ((activeRestaurants?.length || 0) > 0 && (activeUsers?.length || 0) > 0) {
      return { status: 'online', text: 'All Systems Operational', class: 'online' };
    }
    return { status: 'degraded', text: 'Partial Outage', class: 'degraded' };
  };

  const systemStatus = getSystemStatus();

  // Show loading state
  if (loading || restaurantsLoading || usersLoading || adminLoading) {
    return (
      <footer className="admin-footer">
        <div className="admin-footer-container">
          <div className="footer-loading">
            <span>Loading footer data...</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="admin-footer">
      <div className="admin-footer-container">
        
        {/* Stats Section */}
        <div className="footer-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">
                {loading ? '...' : stat.value}
              </div>
              <div className="stat-label">
                {stat.label}
                <span className={`stat-trend ${stat.trend.includes('+') ? 'positive' : 'negative'}`}>
                  {loading ? '...' : stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Links and Info Section */}
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <div className="footer-links">
              {quickLinks.map((link, index) => (
                <a key={index} href={link.path} className="footer-link">
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">System Info</h4>
            <div className="system-info">
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value ${systemStatus.class}`}>
                  {systemStatus.text}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">Just now</span>
              </div>
              <div className="info-item">
                <span className="info-label">Admin:</span>
                <span className="info-value">{admin?.name || 'System Admin'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Version:</span>
                <span className="info-value">v2.4.1</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <div className="support-info">
              <div className="support-item">
                <span className="support-icon">📞</span>
                <span className="support-text">+91 98765 43210</span>
              </div>
              <div className="support-item">
                <span className="support-icon">✉️</span>
                <span className="support-text">support@restaurantadmin.com</span>
              </div>
              <div className="support-item">
                <span className="support-icon">🕒</span>
                <span className="support-text">24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="copyright-text">
              © {currentYear} Restaurant Admin Panel. All rights reserved.
            </span>
            <span className="footer-message">
              Managing {restaurants?.length || 0} restaurants and {totalUsers || 0} users with excellence 🚀
            </span>
          </div>
          <div className="footer-badges">
            <span className="badge secure">🔒 Secure</span>
            <span className="badge fast">⚡ Fast</span>
            <span className="badge reliable">🛡️ Reliable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;