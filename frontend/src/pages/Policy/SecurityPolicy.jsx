import React from "react";
import styles from "./SecurityPolicy.module.css";

const SecurityPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.securityBadge}>🛡️</div>
        <h1 className={styles.heading}>Security Policy</h1>
        <p className={styles.updated}>Last updated: {new Date().toLocaleDateString()}</p>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.intro}>
        <p>
          At <strong>EasyOrderIn</strong>, your security is our top priority. We employ 
          enterprise-grade security measures to protect your data and ensure a safe 
          ordering experience. This policy outlines our comprehensive security practices.
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.blue}`}>🔒</div>
          <div>
            <h2 className={styles.subheading}>Data Protection & Encryption</h2>
            <p className={styles.sectionSubtitle}>Advanced security for your sensitive information</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.securityGrid}>
            <div className={styles.securityFeature}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Data Encryption</h3>
              <ul>
                <li>All sensitive data encrypted using <strong>AES-256</strong></li>
                <li>SSL/TLS encryption for data in transit</li>
                <li>Secure key management practices</li>
              </ul>
            </div>
            <div className={styles.securityFeature}>
              <div className={styles.featureIcon}>💳</div>
              <h3>Payment Security</h3>
              <ul>
                <li>PCI DSS compliant payment processing</li>
                <li>Tokenization for payment information</li>
                <li>Secure integration with Razorpay</li>
              </ul>
            </div>
            <div className={styles.securityFeature}>
              <div className={styles.featureIcon}>🗄️</div>
              <h3>Secure Storage</h3>
              <ul>
                <li>Encrypted database storage</li>
                <li>Regular security backups</li>
                <li>Isolated database environments</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.assurance}>
            <strong>All your data—including personal information, order history, and payment 
            details—is protected with multiple layers of security.</strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.green}`}>👥</div>
          <div>
            <h2 className={styles.subheading}>Access Control & Authentication</h2>
            <p className={styles.sectionSubtitle}>Strict controls over who can access your data</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.accessGrid}>
            <div className={styles.accessTier}>
              <div className={styles.tierHeader}>
                <h3>Role-Based Access</h3>
                <div className={styles.tierBadge}>🔐</div>
              </div>
              <p>Strict role-based permissions ensure only authorized personnel can access specific data types</p>
            </div>
            <div className={styles.accessTier}>
              <div className={styles.tierHeader}>
                <h3>Multi-Factor Authentication</h3>
                <div className={styles.tierBadge}>🔑</div>
              </div>
              <p>Enhanced login security with optional MFA for restaurant administrators</p>
            </div>
            <div className={styles.accessTier}>
              <div className={styles.tierHeader}>
                <h3>Session Management</h3>
                <div className={styles.tierBadge}>⏱️</div>
              </div>
              <p>Automatic session timeouts and secure session handling</p>
            </div>
          </div>

          <div className={styles.protocols}>
            <h3 className={styles.tertiaryHeading}>Security Protocols</h3>
            <ul className={styles.list}>
              <li>Regular access reviews and permission audits</li>
              <li>Background checks for personnel with data access</li>
              <li>Secure authentication mechanisms</li>
              <li>Immediate access revocation for former employees</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.orange}`}>🛡️</div>
          <div>
            <h2 className={styles.subheading}>Platform & Infrastructure Security</h2>
            <p className={styles.sectionSubtitle}>Protecting against modern security threats</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.platformSecurity}>
            <div className={styles.platformItem}>
              <div className={styles.platformIcon}>🔍</div>
              <div className={styles.platformContent}>
                <h3>Regular Security Audits</h3>
                <p>Comprehensive security assessments conducted quarterly</p>
              </div>
            </div>
            <div className={styles.platformItem}>
              <div className={styles.platformIcon}>🚨</div>
              <div className={styles.platformContent}>
                <h3>Threat Monitoring</h3>
                <p>24/7 security monitoring and intrusion detection systems</p>
              </div>
            </div>
            <div className={styles.platformItem}>
              <div className={styles.platformIcon}>🔄</div>
              <div className={styles.platformContent}>
                <h3>Security Updates</h3>
                <p>Regular patches and updates to address vulnerabilities</p>
              </div>
            </div>
            <div className={styles.platformItem}>
              <div className={styles.platformIcon}>🌐</div>
              <div className={styles.platformContent}>
                <h3>Secure Protocols</h3>
                <p>HTTPS enforcement and modern security headers</p>
              </div>
            </div>
          </div>

          <div className={styles.compliance}>
            <h3 className={styles.tertiaryHeading}>Security Standards</h3>
            <div className={styles.standardsGrid}>
              <div className={styles.standard}>OWASP Compliance</div>
              <div className={styles.standard}>Secure SDLC</div>
              <div className={styles.standard}>GDPR Ready</div>
              <div className={styles.standard}>Industry Best Practices</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.red}`}>👤</div>
          <div>
            <h2 className={styles.subheading}>Your Security Responsibilities</h2>
            <p className={styles.sectionSubtitle}>Working together to maintain security</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.userResponsibilities}>
            <div className={styles.responsibilityItem}>
              <div className={styles.responsibilityIcon}>🔐</div>
              <div>
                <h3>Account Security</h3>
                <p>Use strong, unique passwords and enable two-factor authentication when available</p>
              </div>
            </div>
            <div className={styles.responsibilityItem}>
              <div className={styles.responsibilityIcon}>📱</div>
              <div>
                <h3>Device Security</h3>
                <p>Keep your devices and browsers updated with the latest security patches</p>
              </div>
            </div>
            <div className={styles.responsibilityItem}>
              <div className={styles.responsibilityIcon}>👀</div>
              <div>
                <h3>Vigilance</h3>
                <p>Monitor your account for suspicious activity and report it immediately</p>
              </div>
            </div>
            <div className={styles.responsibilityItem}>
              <div className={styles.responsibilityIcon}>🚫</div>
              <div>
                <h3>Access Management</h3>
                <p>Don't share login credentials and log out from shared devices</p>
              </div>
            </div>
          </div>

          <div className={styles.securityTips}>
            <h3 className={styles.tertiaryHeading}>Quick Security Tips</h3>
            <ul className={styles.list}>
              <li>Create passwords with at least 8 characters including numbers and symbols</li>
              <li>Never use the same password across multiple services</li>
              <li>Be cautious of phishing emails asking for login information</li>
              <li>Verify website SSL certificates before entering sensitive data</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.purple}`}>🚨</div>
          <div>
            <h2 className={styles.subheading}>Reporting Security Issues</h2>
            <p className={styles.sectionSubtitle}>Help us keep EasyOrderIn secure</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.reportingCard}>
            <div className={styles.emergencyAlert}>
              <div className={styles.alertIcon}>⚠️</div>
              <div className={styles.alertContent}>
                <h3>Found a Security Vulnerability?</h3>
                <p>We take all security reports seriously and investigate them immediately</p>
              </div>
            </div>

            <div className={styles.reportingSteps}>
              <h3 className={styles.tertiaryHeading}>How to Report</h3>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <strong>Contact Immediately</strong>
                    <p>Use our Contact Us page or email security@easyorderin.com</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <strong>Provide Details</strong>
                    <p>Include steps to reproduce and any relevant information</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <strong>Expect Response</strong>
                    <p>We acknowledge reports within 24 hours and provide updates</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.responsibleDisclosure}>
              <h3 className={styles.tertiaryHeading}>Responsible Disclosure</h3>
              <p>
                We follow responsible disclosure practices. Please allow us time to address 
                vulnerabilities before public disclosure and avoid accessing or modifying 
                other users' data during testing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.securityCommitment}>
        <h3 className={styles.commitmentTitle}>Our Security Commitment</h3>
        <div className={styles.commitmentGrid}>
          <div className={styles.commitmentItem}>
            <div className={styles.commitmentIcon}>🔄</div>
            <div className={styles.commitmentText}>
              <strong>Continuous Improvement</strong>
              <p>Regularly updating our security practices</p>
            </div>
          </div>
          <div className={styles.commitmentItem}>
            <div className={styles.commitmentIcon}>📚</div>
            <div className={styles.commitmentText}>
              <strong>Transparency</strong>
              <p>Clear communication about our security measures</p>
            </div>
          </div>
          <div className={styles.commitmentItem}>
            <div className={styles.commitmentIcon}>🤝</div>
            <div className={styles.commitmentText}>
              <strong>Partnership</strong>
              <p>Working with users to maintain security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPolicy;