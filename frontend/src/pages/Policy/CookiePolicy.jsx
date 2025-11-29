import React from "react";
import styles from "./CookiePolicy.module.css";

const CookiePolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Cookie Policy</h1>
        <p className={styles.updated}>Last updated: {new Date().toLocaleDateString()}</p>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.intro}>
        <div className={styles.cookieIcon}>🍪</div>
        <p>
          At <strong>EasyOrderIn</strong>, we believe in transparency and respect for your privacy. 
          This Cookie Policy explains how we use cookies and similar technologies to enhance 
          your experience while protecting your privacy.
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.blue}`}>❓</div>
          <div>
            <h2 className={styles.subheading}>What Are Cookies?</h2>
            <p className={styles.sectionSubtitle}>Understanding these small but important files</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.definitionCard}>
            <div className={styles.definitionIcon}>📄</div>
            <div className={styles.definitionText}>
              <strong>Cookies</strong> are small text files that websites store on your device 
              when you visit them. They help websites remember your preferences, login status, 
              and other information to provide a better browsing experience.
            </div>
          </div>
          <p>
            Think of cookies as helpful notes that our website leaves on your device to 
            remember your preferences and make your next visit smoother and more personalized.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.green}`}>🔧</div>
          <div>
            <h2 className={styles.subheading}>Essential Cookies We Use</h2>
            <p className={styles.sectionSubtitle}>Minimal cookies for maximum functionality</p>
          </div>
        </div>
        <div className={styles.content}>
          <p>
            EasyOrderIn uses cookies <strong>only when absolutely necessary</strong> for our 
            platform to function properly. Here's what our essential cookies do:
          </p>
          
          <div className={styles.cookieGrid}>
            <div className={styles.cookieCard}>
              <div className={styles.cookieType}>🔐</div>
              <h3 className={styles.cookieTitle}>Session Cookies</h3>
              <p>Keep you securely logged in during your browsing session</p>
            </div>
            <div className={styles.cookieCard}>
              <div className={styles.cookieType}>🛒</div>
              <h3 className={styles.cookieTitle}>Cart Cookies</h3>
              <p>Remember your order selections and cart items</p>
            </div>
            <div className={styles.cookieCard}>
              <div className={styles.cookieType}>⚙️</div>
              <h3 className={styles.cookieTitle}>Functionality Cookies</h3>
              <p>Ensure all platform features work correctly</p>
            </div>
          </div>

          <div className={styles.assurance}>
            <strong>All these cookies are:</strong>
            <ul className={styles.list}>
              <li>Essential for platform operation</li>
              <li>Automatically deleted when you close your browser (session cookies)</li>
              <li>Not used to track your browsing behavior</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.red}`}>🚫</div>
          <div>
            <h2 className={styles.subheading}>What We Don't Use</h2>
            <p className={styles.sectionSubtitle}>Your privacy is our priority</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.privacyShield}>
            <div className={styles.shieldIcon}>🛡️</div>
            <div className={styles.shieldContent}>
              <h3>No Tracking or Marketing Cookies</h3>
              <p>
                We <strong>do not use</strong> any of the following:
              </p>
            </div>
          </div>
          
          <div className={styles.prohibitedList}>
            <div className={styles.prohibitedItem}>
              <div className={styles.prohibitedIcon}>📊</div>
              <div className={styles.prohibitedText}>
                <strong>Analytics Cookies</strong> - We don't track your browsing behavior
              </div>
            </div>
            <div className={styles.prohibitedItem}>
              <div className={styles.prohibitedIcon}>🎯</div>
              <div className={styles.prohibitedText}>
                <strong>Advertising Cookies</strong> - No targeted ads or marketing tracking
              </div>
            </div>
            <div className={styles.prohibitedItem}>
              <div className={styles.prohibitedIcon}>👥</div>
              <div className={styles.prohibitedText}>
                <strong>Third-Party Cookies</strong> - No external tracking services
              </div>
            </div>
          </div>

          <div className={styles.privacyNote}>
            <strong>Your privacy is fully respected.</strong> We believe in providing essential 
            services without compromising your personal data or browsing privacy.
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.orange}`}>⚙️</div>
          <div>
            <h2 className={styles.subheading}>Managing Your Cookies</h2>
            <p className={styles.sectionSubtitle}>You're in control</p>
          </div>
        </div>
        <div className={styles.content}>
          <p>
            You can manage or disable cookies through your browser settings. Here's how:
          </p>
          
          <div className={styles.managementTips}>
            <div className={styles.tipCard}>
              <h4>🌐 Browser Settings</h4>
              <p>Most browsers allow you to block or delete cookies in their privacy settings</p>
            </div>
            <div className={styles.tipCard}>
              <h4>📱 Mobile Devices</h4>
              <p>Mobile browsers also provide cookie management in their settings menu</p>
            </div>
            <div className={styles.tipCard}>
              <h4>🔍 Private Browsing</h4>
              <p>Use incognito/private mode to automatically clear cookies after your session</p>
            </div>
          </div>

          <div className={styles.warning}>
            <strong>Important Note:</strong> Disabling essential cookies may prevent certain 
            features of our platform from working properly, such as staying logged in or 
            keeping items in your cart.
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.purple}`}>📞</div>
          <div>
            <h2 className={styles.subheading}>Questions & Contact</h2>
            <p className={styles.sectionSubtitle}>We're here to help</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contactCard}>
            <p>
              If you have any questions about our Cookie Policy or how we use cookies, 
              please don't hesitate to reach out:
            </p>
            <div className={styles.contactOptions}>
              <a href="/contact" className={styles.contactButton}>
                📧 Contact Us Page
              </a>
              <span className={styles.contactEmail}>
                or email: <strong>easyorderin.vkshukla@gmail.com</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Quick Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>✅</div>
            <div className={styles.summaryText}>
              <strong>We Use:</strong> Essential session cookies only
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>❌</div>
            <div className={styles.summaryText}>
              <strong>We Don't Use:</strong> Tracking or marketing cookies
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>🔒</div>
            <div className={styles.summaryText}>
              <strong>Your Control:</strong> Manage cookies in browser settings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;