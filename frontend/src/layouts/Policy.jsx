import { NavLink, Outlet } from "react-router-dom";
import styles from "./Policy.module.css";

const Policy = () => {
  const navItems = [
    { label: "Privacy Policy", path: "/policy/privacy-policy", icon: "🔒" },
    { label: "Terms & Conditions", path: "/policy/terms-and-conditions", icon: "📝" },
    { label: "Refund Policy", path: "/policy/refund-policy", icon: "💰" },
    { label: "Cookie Policy", path: "/policy/cookie-policy", icon: "🍪" },
    { label: "Security Policy", path: "/policy/security-policy", icon: "🛡️" },
    { label: "Contact Us", path: "/policy/contact-us", icon: "📞" },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>🍽️</div>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>EasyOrderIn Policies</h1>
              <p className={styles.subtitle}>Transparent, Secure, and User-Focused</p>
            </div>
          </div>
          <div className={styles.headerInfo}>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navButton} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className={styles.content}>
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Policy;