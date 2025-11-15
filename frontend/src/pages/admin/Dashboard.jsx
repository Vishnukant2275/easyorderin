import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const stats = [
    { title: 'Total Restaurants', value: '156', change: '+12%', icon: '🏪', color: '#667eea' },
    { title: 'Active Orders', value: '342', change: '+8%', icon: '📦', color: '#764ba2' },
    { title: 'Total Revenue', value: '₹2,84,567', change: '+15%', icon: '💰', color: '#f093fb' },
    { title: 'New Users', value: '1,234', change: '+23%', icon: '👥', color: '#4facfe' },
    { title: 'Menu Items', value: '2,847', change: '+5%', icon: '🍽️', color: '#43e97b' },
    { title: 'Avg. Rating', value: '4.7', change: '+0.2', icon: '⭐', color: '#fa709a' }
  ];

  const recentActivities = [
    { id: 1, activity: 'New restaurant "Spice Garden" registered', time: '2 mins ago', type: 'restaurant' },
    { id: 2, activity: 'Order #2847 completed successfully', time: '15 mins ago', type: 'order' },
    { id: 3, activity: 'User John Doe placed a new order', time: '28 mins ago', type: 'user' },
    { id: 4, activity: 'Payment received from Taj Restaurant', time: '1 hour ago', type: 'payment' },
    { id: 5, activity: 'Menu updated by Biryani Blues', time: '2 hours ago', type: 'menu' }
  ];

  const topRestaurants = [
    { name: 'Biryani Blues', orders: 284, revenue: '₹84,567', rating: 4.8 },
    { name: 'Pizza Palace', orders: 198, revenue: '₹67,890', rating: 4.6 },
    { name: 'Burger Hub', orders: 167, revenue: '₹45,678', rating: 4.5 },
    { name: 'Chinese Wok', orders: 142, revenue: '₹52,345', rating: 4.7 }
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        <p className={styles.dashboardSubtitle}>Overview of your restaurant platform</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
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
          </div>
        ))}
      </div>

      <div className={styles.dashboardContent}>
        {/* Recent Activities */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Activities</h2>
            <button className={styles.viewAllBtn}>View All</button>
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
                </div>
                <div className={styles.activityDetails}>
                  <p className={styles.activityText}>{activity.activity}</p>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Restaurants */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top Restaurants</h2>
            <button className={styles.viewAllBtn}>View All</button>
          </div>
          <div className={styles.restaurantsList}>
            {topRestaurants.map((restaurant, index) => (
              <div key={index} className={styles.restaurantItem}>
                <div className={styles.restaurantInfo}>
                  <h4 className={styles.restaurantName}>{restaurant.name}</h4>
                  <div className={styles.restaurantStats}>
                    <span className={styles.restaurantStat}>Orders: {restaurant.orders}</span>
                    <span className={styles.restaurantStat}>Revenue: {restaurant.revenue}</span>
                    <span className={styles.restaurantRating}>⭐ {restaurant.rating}</span>
                  </div>
                </div>
                <button className={styles.viewBtn}>View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;