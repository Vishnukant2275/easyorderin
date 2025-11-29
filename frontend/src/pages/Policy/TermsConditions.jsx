import React from "react";
import styles from "./TermsConditions.module.css";

const TermsConditions = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Terms & Conditions</h1>
        <p className={styles.updated}>Last updated: {new Date().toLocaleDateString()}</p>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.intro}>
        <p>
          Welcome to <strong>EasyOrderIn</strong>. These Terms & Conditions govern your use of our 
          QR table order management system and related services. By using our platform, you agree 
          to comply with these terms.
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.blue}`}>📱</div>
          <h2 className={styles.subheading}>Our Services</h2>
        </div>
        <p>EasyOrderIn provides restaurants with comprehensive digital solutions including:</p>
        <ul className={styles.list}>
          <li><strong>QR-based table ordering system</strong> for seamless customer experience</li>
          <li><strong>Performance analytics</strong> and business insights</li>
          <li><strong>Daily financial statements</strong> and reporting</li>
          <li><strong>Menu management</strong> with easy upload and editing capabilities</li>
          <li><strong>Integrated payment processing</strong> through trusted partners</li>
          <li><strong>Real-time order tracking</strong> and management</li>
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.red}`}>⚖️</div>
          <h2 className={styles.subheading}>Your Responsibilities</h2>
        </div>
        <p>As a user of our platform, you agree to:</p>
        <ul className={styles.list}>
          <li>Use the platform only for its intended purposes</li>
          <li>Maintain accurate and up-to-date restaurant information</li>
          <li>Ensure all menu items and prices are correctly displayed</li>
          <li>Not engage in any fraudulent or malicious activities</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>
        <div className={styles.warning}>
          <strong>Important:</strong> Any misuse or violation of these terms may result in immediate account suspension.
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.green}`}>💳</div>
          <h2 className={styles.subheading}>Payments & Financial Terms</h2>
        </div>
        <div className={styles.paymentInfo}>
          <h3 className={styles.tertiaryHeading}>Payment Processing</h3>
          <ul className={styles.list}>
            <li>All customer payments are processed securely through <strong>Razorpay</strong></li>
            <li>Payments are automatically split between the platform and restaurant</li>
            <li>Restaurants receive their portion directly to their registered account</li>
          </ul>
          
          <h3 className={styles.tertiaryHeading}>Commission Structure</h3>
          <ul className={styles.list}>
            <li><strong>Free for restaurants</strong> - no setup or monthly fees</li>
            <li>Commission is charged only to customers where applicable</li>
            <li>Transparent pricing with no hidden charges</li>
          </ul>
          
          <h3 className={styles.tertiaryHeading}>Refunds & Cancellations</h3>
          <p>
            All refund and cancellation requests are handled according to our 
            <strong> Refund & Cancellation Policy</strong>. Please refer to that document 
            for detailed procedures.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.orange}`}>🛡️</div>
          <h2 className={styles.subheading}>Liability & Responsibilities</h2>
        </div>
        <div className={styles.liabilityNote}>
          <p>
            While we strive to provide reliable services, restaurants are responsible for:
          </p>
          <ul className={styles.list}>
            <li>Accuracy of menu items, prices, and descriptions</li>
            <li>Order fulfillment and food quality</li>
            <li>Customer service and issue resolution</li>
            <li>Compliance with food safety regulations</li>
          </ul>
          <p className={styles.disclaimer}>
            <strong>Disclaimer:</strong> EasyOrderIn is not liable for losses, delays, incorrect orders, 
            or any issues arising from restaurant operations or third-party services.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.purple}`}>🚫</div>
          <h2 className={styles.subheading}>Account Management</h2>
        </div>
        <p>
          We reserve the right to suspend or terminate accounts that:
        </p>
        <ul className={styles.list}>
          <li>Violate these Terms & Conditions</li>
          <li>Engage in fraudulent activities</li>
          <li>Repeatedly provide poor customer service</li>
          <li>Fail to maintain operational standards</li>
        </ul>
        <p>
          Account holders will typically receive notice before suspension, except in cases of 
          severe violations.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.teal}`}>⚖️</div>
          <h2 className={styles.subheading}>Legal Jurisdiction</h2>
        </div>
        <div className={styles.legalInfo}>
          <p>
            These Terms & Conditions are governed by and construed in accordance with the laws 
            of India. Any legal disputes shall be subject to the exclusive jurisdiction of:
          </p>
          <div className={styles.jurisdiction}>
            <strong>Satna District Court, Madhya Pradesh, India</strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.yellow}`}>🔄</div>
          <h2 className={styles.subheading}>Policy Updates</h2>
        </div>
        <div className={styles.updateInfo}>
          <p>
            We may update these Terms & Conditions to reflect changes in our services or 
            legal requirements. When we make changes:
          </p>
          <ul className={styles.list}>
            <li>We will update the "Last updated" date at the top of this page</li>
            <li>Significant changes will be communicated via email or platform notifications</li>
            <li>Continued use of our services constitutes acceptance of the updated terms</li>
          </ul>
          <p className={styles.note}>
            You may reject updated terms by discontinuing use of our platform.
          </p>
        </div>
      </section>

      <div className={styles.contactSection}>
        <h3 className={styles.contactHeading}>Questions?</h3>
        <p>
          If you have any questions about these Terms & Conditions, please contact us 
          through our support channels. We're here to help you understand your rights 
          and responsibilities.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;