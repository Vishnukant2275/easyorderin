import React from "react";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className={styles.intro}>
        <p>
          At <strong>EasyOrderIn</strong>, we value your privacy and are committed to protecting 
          your personal information. This policy explains how we collect, use, and safeguard 
          your data when you use our services.
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.subheading}>Information We Collect</h2>
          <div className={styles.icon}>📋</div>
        </div>
        <p>
          We collect information that you directly provide to us, including:
        </p>
        <ul className={styles.list}>
          <li>Your <strong>name</strong> and <strong>contact details</strong></li>
          <li><strong>Email address</strong> and <strong>phone number</strong></li>
          <li><strong>Payment information</strong> processed securely through our partners</li>
          <li>Your <strong>order history</strong> and preferences</li>
        </ul>
        <p className={styles.note}>
          We use cookies only for essential functions like maintaining your session – no tracking or marketing cookies.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.subheading}>How We Use Your Information</h2>
          <div className={styles.icon}>🎯</div>
        </div>
        <p>Your information helps us:</p>
        <ul className={styles.list}>
          <li>Process and manage your orders efficiently</li>
          <li>Send you order confirmations and OTPs for security</li>
          <li>Improve our platform and your experience</li>
          <li>Communicate important updates about your orders</li>
          <li>Comply with legal requirements</li>
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.subheading}>Information Sharing</h2>
          <div className={styles.icon}>🤝</div>
        </div>
        <p>
          We only share your information when necessary:
        </p>
        <ul className={styles.list}>
          <li>With <strong>restaurants</strong> to fulfill your orders</li>
          <li>With <strong>Razorpay</strong> for secure payment processing</li>
        </ul>
        <p className={styles.emphasis}>
          We <strong>never sell</strong> your personal information to third parties.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.subheading}>Data Security & Retention</h2>
          <div className={styles.icon}>🔒</div>
        </div>
        <p>
          We retain your information only as long as you use our services and take your security seriously:
        </p>
        <ul className={styles.list}>
          <li>All sensitive data is <strong>encrypted</strong></li>
          <li>Regular security assessments and updates</li>
          <li>Secure storage practices</li>
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.subheading}>Your Rights & Control</h2>
          <div className={styles.icon}>⚖️</div>
        </div>
        <p>
          You have the right to:
        </p>
        <ul className={styles.list}>
          <li>Access the personal information we hold about you</li>
          <li>Correct any inaccurate information</li>
          <li>Request deletion of your personal data</li>
          <li>Ask questions about how your data is used</li>
        </ul>
        <p>
          To exercise any of these rights, please visit our <strong>Contact Us</strong> page.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.subheading}>Need Help?</h2>
          <div className={styles.icon}>📞</div>
        </div>
        <p>
          If you have any questions about this Privacy Policy or how we handle your information, 
          we're here to help. Please reach out through our <strong>Contact Us</strong> page – 
          we typically respond within 24 hours.
        </p>
      </section>

      <div className={styles.footer}>
        <p>Thank you for trusting EasyOrderIn with your orders!</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;