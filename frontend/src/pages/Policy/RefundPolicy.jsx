import React from "react";
import styles from "./RefundPolicy.module.css";

const RefundPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Refund & Cancellation Policy</h1>
        <p className={styles.updated}>Last updated: {new Date().toLocaleDateString()}</p>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.intro}>
        <p>
          At <strong>EasyOrderIn</strong>, we strive to provide fair and transparent refund 
          and cancellation procedures. This policy outlines the terms for order cancellations 
          and refunds for both customers and restaurants.
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.red}`}>⏰</div>
          <div>
            <h2 className={styles.subheading}>Customer Cancellations</h2>
            <p className={styles.sectionSubtitle}>Limited time window for order modifications</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.highlightBox}>
            <div className={styles.timeLimit}>
              <span className={styles.timeNumber}>1</span>
              <span className={styles.timeUnit}>MINUTE</span>
            </div>
            <div className={styles.timeText}>
              Cancellation window from order placement time
            </div>
          </div>
          <ul className={styles.list}>
            <li>
              <strong>No refunds</strong> will be processed for customer cancellations, even within the 1-minute window
            </li>
            <li>
              Platform commission is <strong>non-refundable</strong> in all cases
            </li>
            <li>
              This policy helps prevent food wastage and ensures efficient restaurant operations
            </li>
          </ul>
          <div className={styles.note}>
            <strong>Note:</strong> We encourage customers to review their orders carefully before confirming.
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.orange}`}>🏪</div>
          <div>
            <h2 className={styles.subheading}>Restaurant Cancellations</h2>
            <p className={styles.sectionSubtitle}>Responsibilities and charges for order cancellations</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.chargeBox}>
            <div className={styles.chargeAmount}>10%</div>
            <div className={styles.chargeLabel}>of order value charged</div>
          </div>
          <p>When restaurants cancel orders:</p>
          <ul className={styles.list}>
            <li>Customers receive a <strong>full refund</strong> of their payment</li>
            <li>Restaurants are charged <strong>10% of the order amount</strong> as a cancellation fee</li>
            <li>This fee compensates for platform resources and customer inconvenience</li>
          </ul>
          
          <div className={styles.responsibility}>
            <h3 className={styles.tertiaryHeading}>Restaurant Responsibilities</h3>
            <ul className={styles.list}>
              <li>Keep menu availability updated in real-time</li>
              <li>Manage order acceptance capacity appropriately</li>
              <li>Disable order acceptance during busy periods or kitchen closures</li>
            </ul>
            <div className={styles.warning}>
              <strong>Important:</strong> Restaurants that accept orders but subsequently cancel 
              them will be charged the 10% cancellation fee.
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.green}`}>💰</div>
          <div>
            <h2 className={styles.subheading}>Refund Process</h2>
            <p className={styles.sectionSubtitle}>Timelines and payment methods</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <strong>Processing Time:</strong> Up to 1 week
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <strong>Actual Transfer:</strong> 1-2 business days
              </div>
            </div>
          </div>
          <ul className={styles.list}>
            <li>Refunds are processed automatically to the original payment method</li>
            <li>Supported payment methods: Razorpay and other integrated APIs</li>
            <li>Customers will receive notification once refund is initiated</li>
            <li>Bank processing times may vary depending on financial institutions</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.purple}`}>💼</div>
          <div>
            <h2 className={styles.subheading}>Commission Policy</h2>
            <p className={styles.sectionSubtitle}>Platform fees and charges</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.commissionNote}>
            <strong>Platform commission is non-refundable in all scenarios</strong>
          </div>
          <ul className={styles.list}>
            <li>Applies to both customer and restaurant cancellations</li>
            <li>Covers platform operational costs and services rendered</li>
            <li>Commission rates are transparent and displayed during onboarding</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.icon} ${styles.blue}`}>📋</div>
          <div>
            <h2 className={styles.subheading}>Additional Terms & Conditions</h2>
            <p className={styles.sectionSubtitle}>Important rules and guidelines</p>
          </div>
        </div>
        <div className={styles.content}>
          <ul className={styles.list}>
            <li>
              <strong>Order Accuracy:</strong> Customers must verify all order details before confirmation
            </li>
            <li>
              <strong>Menu Management:</strong> Restaurants are responsible for maintaining accurate menu availability
            </li>
            <li>
              <strong>Payment Method:</strong> Refunds are processed exclusively through the original payment gateway
            </li>
            <li>
              <strong>Policy Updates:</strong> EasyOrderIn reserves the right to modify this policy with notice
            </li>
            <li>
              <strong>Dispute Resolution:</strong> All disputes will be resolved according to our Terms of Service
            </li>
          </ul>
          
          <div className={styles.contact}>
            <h3 className={styles.tertiaryHeading}>Need Assistance?</h3>
            <p>
              If you have questions about refunds or cancellations, please contact our 
              support team through the Help section in your account.
            </p>
          </div>
        </div>
      </section>

      <div className={styles.summary}>
        <h3 className={styles.summaryHeading}>Policy Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>👤</div>
            <div className={styles.summaryText}>
              <strong>Customer Cancels:</strong> No refund, commission retained
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>🏪</div>
            <div className={styles.summaryText}>
              <strong>Restaurant Cancels:</strong> Full customer refund, 10% restaurant charge
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>⏱️</div>
            <div className={styles.summaryText}>
              <strong>Refund Time:</strong> 1 week processing, 1-2 days transfer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;