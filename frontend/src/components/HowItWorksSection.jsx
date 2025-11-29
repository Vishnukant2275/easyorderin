import React, { useState, useEffect } from "react";
import styles from "./HowItWorksSection.module.css";

function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("how-it-works");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const steps = [
    {
      icon: "📱",
      title: "Scan Your QR",
      description: "Customers scan a unique QR code placed on each table to instantly access the restaurant's digital menu.",
      features: ["No app download required", "Instant menu access", "Table-specific ordering"],
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      video: "#scan-demo"
    },
    {
      icon: "🛒",
      title: "Place Your Order",
      description: "Browse the menu, customize your order, and submit it directly from your phone—no waiting for a waiter.",
      features: ["Real-time menu updates", "Customization options", "Instant order confirmation"],
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      video: "#order-demo"
    },
    {
      icon: "📊",
      title: "Track & Grow",
      description: "Restaurants receive real-time orders, generate reports, and analyze customer preferences to improve sales.",
      features: ["Live order dashboard", "Sales analytics", "Customer insights"],
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      video: "#analytics-demo"
    }
  ];

  return (
    <section id="how-it-works" className={styles.section}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.bgElement1}>📱</div>
        <div className={styles.bgElement2}>🛒</div>
      </div>

      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            How It Works
          </h2>
          <p className={styles.subtitle}>
            Experience the future of dining with our seamless three-step process
          </p>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.progressSegment} ${activeStep >= index ? styles.active : ''}`}
                  style={{ background: steps[index].color }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className={styles.stepsWrapper}>
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`${styles.stepCard} ${isVisible ? styles.visible : ''} ${
                activeStep === index ? styles.active : ''
              }`}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(0)}
              onClick={() => setActiveStep(index)}
            >
              {/* Connection Line - Desktop only */}
              {index < steps.length - 1 && (
                <div className={styles.connectionLine}></div>
              )}

              {/* Step Number */}
              <div className={styles.stepNumber}>
                {index + 1}
              </div>

              {/* Icon Circle */}
              <div
                className={styles.stepIcon}
                style={{ background: step.color }}
              >
                <span className={styles.icon}>{step.icon}</span>
              </div>

              {/* Content */}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>

              {/* Features List */}
              <ul className={styles.featuresList}>
                {step.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <a 
                href={step.video} 
                className={styles.demoButton}
                style={{ '--button-color': step.color }}
              >
                Watch Demo 
                <span className={styles.playIcon}>▶</span>
              </a>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h4 className={styles.ctaTitle}>Ready to Transform Your Restaurant?</h4>
            <p className={styles.ctaDescription}>
              Join thousands of restaurants already using EasyOrderIn to enhance their customer experience and boost sales.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryButton}>
                Get Started Free
                <span className={styles.buttonIcon}>→</span>
              </button>
              <button className={styles.secondaryButton}>
                <span className={styles.buttonIcon}>▶</span>
                Watch Full Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;