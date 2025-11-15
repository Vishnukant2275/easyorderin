import React from 'react';
import './AdminFooter.css';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Support', path: '/admin/support' },
    { name: 'Documentation', path: '/admin/docs' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  const stats = [
    { label: 'Active Restaurants', value: '24', trend: '+2' },
    { label: 'Pending Orders', value: '156', trend: '+12' },
    { label: 'Total Revenue', value: '₹1,24,580', trend: '+8.2%' },
  ];

  return (
    <footer className="admin-footer">
      <div className="admin-footer-container">
        
        {/* Stats Section */}
        <div className="footer-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">
                {stat.label}
                <span className="stat-trend positive">{stat.trend}</span>
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
                <span className="info-value online">All Systems Operational</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">Just now</span>
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
              Managing your restaurants with excellence 🚀
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