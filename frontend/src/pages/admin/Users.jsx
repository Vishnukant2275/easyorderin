import React, { useState } from 'react';
import styles from './Users.module.css';

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav.sharma@email.com',
      phone: '+91 9876543210',
      joinDate: '2024-01-15',
      totalOrders: 12,
      totalSpent: '₹8,450',
      favoriteRestaurant: 'Biryani Blues',
      lastOrder: '2024-03-20',
      status: 'active'
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 9876543211',
      joinDate: '2024-01-18',
      totalOrders: 8,
      totalSpent: '₹5,670',
      favoriteRestaurant: 'Pizza Palace',
      lastOrder: '2024-03-18',
      status: 'active'
    },
    {
      id: 3,
      name: 'Rohan Kumar',
      email: 'rohan.kumar@email.com',
      phone: '+91 9876543212',
      joinDate: '2024-02-01',
      totalOrders: 15,
      totalSpent: '₹12,340',
      favoriteRestaurant: 'Burger Hub',
      lastOrder: '2024-03-19',
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Neha Gupta',
      email: 'neha.gupta@email.com',
      phone: '+91 9876543213',
      joinDate: '2024-02-15',
      totalOrders: 6,
      totalSpent: '₹3,890',
      favoriteRestaurant: 'Chinese Wok',
      lastOrder: '2024-03-15',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'totalOrders':
          return b.totalOrders - a.totalOrders;
        case 'totalSpent':
          return parseFloat(b.totalSpent.replace('₹', '').replace(',', '')) - 
                 parseFloat(a.totalSpent.replace('₹', '').replace(',', ''));
        case 'joinDate':
        default:
          return new Date(b.joinDate) - new Date(a.joinDate);
      }
    });

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#48bb78' : '#e53e3e';
  };

  return (
    <div className={styles.users}>
      <div className={styles.usersHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.usersTitle}>User Management</h1>
          <p className={styles.usersSubtitle}>Manage all registered users and their activities</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{users.length}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{users.filter(u => u.status === 'active').length}</span>
            <span className={styles.statLabel}>Active Users</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        
        <div className={styles.filters}>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="joinDate">Sort by Join Date</option>
            <option value="name">Sort by Name</option>
            <option value="totalOrders">Sort by Orders</option>
            <option value="totalSpent">Sort by Total Spent</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.usersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <div className={styles.colUser}>User</div>
            <div className={styles.colContact}>Contact</div>
            <div className={styles.colStats}>Statistics</div>
            <div className={styles.colFavorite}>Favorite</div>
            <div className={styles.colStatus}>Status</div>
            <div className={styles.colActions}>Actions</div>
          </div>
        </div>
        
        <div className={styles.tableBody}>
          {filteredUsers.map(user => (
            <div key={user.id} className={styles.tableRow}>
              <div className={styles.colUser}>
                <div className={styles.userAvatar}>
                  {getUserInitials(user.name)}
                </div>
                <div className={styles.userInfo}>
                  <h4 className={styles.userName}>{user.name}</h4>
                  <p className={styles.userEmail}>{user.email}</p>
                  <span className={styles.joinDate}>Joined: {user.joinDate}</span>
                </div>
              </div>
              
              <div className={styles.colContact}>
                <div className={styles.contactInfo}>
                  <span className={styles.phone}>{user.phone}</span>
                </div>
              </div>
              
              <div className={styles.colStats}>
                <div className={styles.userStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{user.totalOrders}</span>
                    <span className={styles.statLabel}>Orders</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{user.totalSpent}</span>
                    <span className={styles.statLabel}>Spent</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{user.lastOrder}</span>
                    <span className={styles.statLabel}>Last Order</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.colFavorite}>
                <span className={styles.favoriteRestaurant}>
                  {user.favoriteRestaurant}
                </span>
              </div>
              
              <div className={styles.colStatus}>
                <span 
                  className={styles.statusBadge}
                  style={{ 
                    backgroundColor: getStatusColor(user.status) + '20',
                    color: getStatusColor(user.status)
                  }}
                >
                  {user.status}
                </span>
              </div>
              
              <div className={styles.colActions}>
                <div className={styles.actionButtons}>
                  <button className={styles.viewBtn}>View</button>
                  <button className={styles.ordersBtn}>Orders</button>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>👥</div>
          <h3>No users found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Users;