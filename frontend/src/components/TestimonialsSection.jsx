import React from "react";
import styles from "./TestimonialsSection.module.css";

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: "The food quality and delivery service are exceptional! I've never been disappointed with my orders. EasyOrderIn makes dining so convenient!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Food Enthusiast",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: "Best food ordering experience I've had. The variety of restaurants is amazing and the QR code system is genius!",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      role: "Food Blogger",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: "I love how easy it is to order. The interface is user-friendly and the delivery is always on time. Perfect for busy food bloggers!",
      rating: 4,
    },
    {
      name: "Raj Patel",
      role: "Restaurant Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: "As a restaurant owner, EasyOrderIn has transformed our operations. Orders come in seamlessly and we save so much time!",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      role: "Frequent Diner",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: "No more waiting for waiters! Scanning the QR and ordering directly from my phone has changed how I dine out.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Tech Enthusiast",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      text: "The technology behind EasyOrderIn is impressive. Fast, reliable, and incredibly convenient for modern dining.",
      rating: 4,
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.filled : ""}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What Our Customers Say</h2>
          <p className={styles.subtitle}>
            Don't just take our word for it - hear from restaurants and customers who love EasyOrderIn
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.cardContent}>
                {/* Rating */}
                <div className={styles.rating}>
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <p className={styles.text}>"{testimonial.text}"</p>

                {/* Author Info */}
                <div className={styles.author}>
                  <div className={styles.avatar}>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.name}>{testimonial.name}</h4>
                    <p className={styles.role}>{testimonial.role}</p>
                  </div>
                </div>

                {/* Decorative Quote */}
                <div className={styles.quoteIcon}>❝</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Happy Restaurants</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50K+</div>
            <div className={styles.statLabel}>Orders Processed</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>4.8/5</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;