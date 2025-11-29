import React, { useState } from "react";
import styles from "./VideoSection.module.css";

function VideoSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section className={styles.section} id="video">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>See EasyOrderIn in Action</h2>
          <p className={styles.subtitle}>
            Watch how restaurants transform their customer experience in under 2 minutes
          </p>
        </div>

        <div className={styles.videoContainer}>
          {!isVideoLoaded && (
            <div className={styles.videoPlaceholder}>
              <div className={styles.placeholderContent}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading video...</p>
              </div>
            </div>
          )}
          
          <div className={`${styles.videoWrapper} ${isVideoLoaded ? styles.loaded : ''}`}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/xdZiUuwZeOI?si=0x-3bnEofc55a6Jg"
              title="EasyOrderIn Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={handleVideoLoad}
              loading="lazy"
            />
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🚀</div>
              <h4>Quick Setup</h4>
              <p>Get started in under 5 minutes</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💳</div>
              <h4>Zero Commission</h4>
              <p>No hidden fees for restaurants</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📱</div>
              <h4>Mobile First</h4>
              <p>Works on any smartphone</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>⚡</div>
              <h4>Instant Orders</h4>
              <p>Real-time order processing</p>
            </div>
          </div>
        </div>

        <div className={styles.cta}>
          <h3 className={styles.ctaTitle}>Ready to Get Started?</h3>
          <p className={styles.ctaText}>
            Join hundreds of restaurants already using EasyOrderIn
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton}>
              Start Free Trial
              <span className={styles.buttonIcon}>→</span>
            </button>
            <button className={styles.secondaryButton}>
              <span className={styles.buttonIcon}>📞</span>
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;