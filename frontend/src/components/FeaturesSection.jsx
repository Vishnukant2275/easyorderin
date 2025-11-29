import React from "react";
import styles from "./FeaturesSection.module.css";

function FeaturesSection() {
  const features = [
    {
      title: "Unique QR Codes for Every Table",
      description: "Each table in your restaurant gets its own QR code, making it simple for customers to browse menus and place orders instantly.",
      image: "https://images.unsplash.com/photo-1600147131759-880e94a6185f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cXIlMjBjb2RlfGVufDB8fDB8fHww",
      icon: "📱"
    },
    {
      title: "Smart Order Management",
      description: "Let our system handle your orders seamlessly. Focus on great service while we streamline the order-taking process.",
      image: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuYWdlbWVudHxlbnwwfHwwfHx8MA%3D%3D",
      icon: "⚡"
    },
    {
      title: "Data-Driven Customer Insights",
      description: "Track daily orders and gain valuable insights about your customers' preferences to grow your restaurant smarter.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGF0YXxlbnwwfHwwfHx8MA%3D%3D",
      icon: "📊"
    },
    {
      title: "Real-time Order Updates",
      description: "Get instant notifications for new orders and track order status in real-time for better kitchen management.",
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVhbHRpbWV8ZW58MHx8MHx8fDA%3D",
      icon: "🔄"
    },
    {
      title: "Instant Payment Processing",
      description: "Secure and fast payment processing with multiple options. Customers pay directly through their phones.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGF5bWVudHxlbnwwfHwwfHx8MA%3D%3D",
      icon: "💳"
    },
    {
      title: "Menu Customization",
      description: "Easily update your menu, add specials, and manage inventory in real-time from any device.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMG1lbnV8ZW58MHx8MHx8fDA%3D",
      icon: "🍽️"
    }
  ];

  return (
    <section className={styles.section} id="features">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Amazing Features</h2>
          <p className={styles.subtitle}>
            Everything you need to transform your restaurant experience
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div 
                className={styles.cardBackground}
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${feature.image}')`
                }}
              >
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>
                    <span className={styles.icon}>{feature.icon}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{feature.title}</h3>
                  <p className={styles.cardDescription}>{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;