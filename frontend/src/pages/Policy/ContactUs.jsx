import React, { useState } from "react";
import styles from "./ContactUs.module.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Submitting...");
    
    try {
      // Replace "/api/contact" with your backend endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "success":
        return "🎉 Message sent successfully! We'll reply within 48 hours (usually 1-2 hours).";
      case "error":
        return "❌ Failed to send message. Please try again later or contact us directly.";
      case "Submitting...":
        return "⏳ Sending your message...";
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Get In Touch</h1>
        <p className={styles.subheading}>
          We're here to help! Typically respond within <strong>48 hours</strong> (usually 1–2 hours).
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.contactInfo}>
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIcon}>📧</div>
              <h3>Email Us</h3>
            </div>
            <a href="mailto:easyorderin.vkshukla@gmail.com" className={styles.contactLink}>
              easyorderin.vkshukla@gmail.com
            </a>
            <p>Send us an email anytime</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIcon}>📞</div>
              <h3>Call Us</h3>
            </div>
            <a href="tel:+919999999999" className={styles.contactLink}>
              +91 99999 99999
            </a>
            <p>Mon-Fri, 9AM-6PM</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIcon}>📍</div>
              <h3>Visit Us</h3>
            </div>
            <p className={styles.address}>
              Village Post Bairahana,<br />
              District Satna, MP<br />
              Pin 485226
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIcon}>🌐</div>
              <h3>Follow Us</h3>
            </div>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>Facebook</a>
              <a href="#" className={styles.socialLink}>Instagram</a>
              <a href="#" className={styles.socialLink}>LinkedIn</a>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Send us a Message</h2>
            <p className={styles.formDescription}>
              Have questions about EasyOrderIn? We'd love to hear from you.
            </p>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message" className={styles.label}>Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={styles.textarea}
                  rows="5"
                />
              </div>

              <button 
                type="submit" 
                className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner}></div>
                    Sending...
                  </>
                ) : (
                  <>
                    📨 Send Message
                  </>
                )}
              </button>

              {status && (
                <div className={`${styles.status} ${styles[status]}`}>
                  {getStatusMessage()}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className={styles.faqSection}>
        <h3 className={styles.faqTitle}>Quick Help</h3>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h4>💡 Technical Support</h4>
            <p>Having issues with QR codes or order management? We'll help you troubleshoot.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>🏪 Restaurant Onboarding</h4>
            <p>Interested in joining EasyOrderIn? Learn about our setup process.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>💳 Payment Questions</h4>
            <p>Questions about payment processing or commission? Get clarity here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;