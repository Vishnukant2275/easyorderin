import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./HeroSection.module.css";

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Transform Your Restaurant's Digital Presence
            </h1>
            <p className={styles.description}>
              Join thousands of successful restaurants who have revolutionized their
              business with our digital ordering platform. Streamline your
              operations, increase customer satisfaction, and boost your revenue
              with our easy-to-use system.
            </p>
            <div className={styles.buttons}>
              <NavLink
                to="/restaurant/signup"
                className={styles.primaryButton}
              >
                Register Now
              </NavLink>
              <NavLink
                to="/restaurant/login"
                className={styles.secondaryButton}
              >
                Already Registered
              </NavLink>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <img
              className={styles.heroImage}
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=720"
              alt="Restaurant interior with ambient lighting"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;