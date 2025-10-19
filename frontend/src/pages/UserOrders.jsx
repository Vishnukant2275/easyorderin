import React, { useState } from 'react';
import styles from './UserOrders.module.css';

const UserOrders = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  const orders = {
    active: [
      {
        id: 'ORD-001',
        status: 'preparing',
        statusText: 'Being Prepared',
        items: [
          { name: 'Veg Noodles', quantity: 2, price: 110 },
          { name: 'Aloo Tikki Burger', quantity: 1, price: 70 }
        ],
        total: 290,
        orderTime: '2024-01-15T18:30:00',
        estimatedTime: '2024-01-15T19:00:00',
        table: '05'
      },
      {
        id: 'ORD-002',
        status: 'confirmed',
        statusText: 'Order Confirmed',
        items: [
          { name: 'Lemon Coriander Soup', quantity: 1, price: 110 }
        ],
        total: 110,
        orderTime: '2024-01-15T19:15:00',
        estimatedTime: '2024-01-15T19:45:00',
        table: '05'
      }
    ],
    past: [
      {
        id: 'ORD-003',
        status: 'completed',
        statusText: 'Completed',
        items: [
          { name: 'Cream Of Tomato Soup', quantity: 1, price: 130 },
          { name: 'Veg Biryani', quantity: 1, price: 180 }
        ],
        total: 310,
        orderTime: '2024-01-14T19:30:00',
        completedTime: '2024-01-14T20:15:00',
        table: '05',
        rating: 4
      },
      {
        id: 'ORD-004',
        status: 'cancelled',
        statusText: 'Cancelled',
        items: [
          { name: 'Paneer Butter Masala', quantity: 1, price: 250 }
        ],
        total: 250,
        orderTime: '2024-01-14T18:00:00',
        cancelledTime: '2024-01-14T18:20:00',
        table: '05'
      }
    ]
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#2196F3',
      preparing: '#FF9800',
      ready: '#4CAF50',
      completed: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#666';
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: '📋',
      preparing: '👨‍🍳',
      ready: '✅',
      completed: '🎉',
      cancelled: '❌'
    };
    return icons[status] || '📦';
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateProgress = (status) => {
    const progress = {
      confirmed: 25,
      preparing: 50,
      ready: 75,
      completed: 100,
      cancelled: 100
    };
    return progress[status] || 0;
  };

  return (
    <div className={styles.ordersContainer}>
      {/* Header */}
      <header className={styles.ordersHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Your Orders</h1>
          <div className={styles.orderStats}>
            <span className={styles.activeCount}>{orders.active.length} Active</span>
          </div>
        </div>
      </header>

      {/* Order Tabs */}
      <div className={styles.orderTabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <span className={styles.tabIcon}>🕒</span>
          Active Orders
          {orders.active.length > 0 && (
            <span className={styles.tabBadge}>{orders.active.length}</span>
          )}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'past' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('past')}
        >
          <span className={styles.tabIcon}>📋</span>
          Order History
        </button>
      </div>

      {/* Orders List */}
      <main className={styles.ordersMain}>
        {orders[activeTab].length === 0 ? (
          <div className={styles.emptyOrders}>
            <div className={styles.emptyIcon}>
              {activeTab === 'active' ? '🕒' : '📋'}
            </div>
            <h2 className={styles.emptyTitle}>
              {activeTab === 'active' ? 'No Active Orders' : 'No Order History'}
            </h2>
            <p className={styles.emptyText}>
              {activeTab === 'active' 
                ? 'Your active orders will appear here' 
                : 'Your past orders will appear here'
              }
            </p>
            {activeTab === 'active' && (
              <button className={styles.browseButton}>Browse Menu</button>
            )}
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders[activeTab].map((order) => (
              <div key={order.id} className={styles.orderCard}>
                {/* Order Header */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderId}>Order #{order.id}</h3>
                    <div className={styles.orderMeta}>
                      <span className={styles.orderTime}>
                        {formatTime(order.orderTime)}
                      </span>
                      <span className={styles.tableBadge}>
                        Table {order.table}
                      </span>
                    </div>
                  </div>
                  <div 
                    className={styles.orderStatus}
                    style={{ color: getStatusColor(order.status) }}
                  >
                    <span className={styles.statusIcon}>
                      {getStatusIcon(order.status)}
                    </span>
                    {order.statusText}
                  </div>
                </div>

                {/* Order Progress (for active orders) */}
                {activeTab === 'active' && order.status !== 'cancelled' && (
                  <div className={styles.orderProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${calculateProgress(order.status)}%` }}
                      ></div>
                    </div>
                    <div className={styles.progressSteps}>
                      <span className={styles.progressStep}>Confirmed</span>
                      <span className={styles.progressStep}>Preparing</span>
                      <span className={styles.progressStep}>Ready</span>
                      <span className={styles.progressStep}>Completed</span>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <div key={index} className={styles.orderItem}>
                      <span className={styles.itemQuantity}>{item.quantity}x</span>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className={styles.orderFooter}>
                  <div className={styles.orderTotal}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalAmount}>₹{order.total}</span>
                  </div>
                  
                  <div className={styles.orderActions}>
                    {activeTab === 'active' && order.status !== 'cancelled' && (
                      <>
                        <button className={styles.actionBtnSecondary}>
                          Track Order
                        </button>
                        <button className={styles.actionBtn}>
                          View Details
                        </button>
                      </>
                    )}
                    {activeTab === 'past' && order.status === 'completed' && (
                      <button className={styles.actionBtn}>
                        Reorder
                      </button>
                    )}
                    {activeTab === 'past' && order.status === 'cancelled' && (
                      <button className={styles.actionBtn}>
                        Order Again
                      </button>
                    )}
                  </div>
                </div>

                {/* Estimated Time (for active orders) */}
                {activeTab === 'active' && order.estimatedTime && (
                  <div className={styles.estimatedTime}>
                    <span className={styles.timeIcon}>⏱️</span>
                    Estimated ready by {formatTime(order.estimatedTime)}
                  </div>
                )}

                {/* Rating (for completed orders) */}
                {activeTab === 'past' && order.status === 'completed' && order.rating && (
                  <div className={styles.orderRating}>
                    <span className={styles.ratingLabel}>Your Rating:</span>
                    <div className={styles.stars}>
                      {'⭐'.repeat(order.rating)}
                      {'☆'.repeat(5 - order.rating)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserOrders;