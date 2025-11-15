import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = ({ 
  homeUrl = '/', 
  buttonText = 'Take Me Home',
  customMessage 
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(homeUrl);
  };

  const defaultMessage = "The page you're looking for seems to have vanished into thin air. Don't worry, even the best explorers get lost sometimes!";

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.notFoundAnimation}>
          <div className={styles.ghost}>
            <div className={styles.ghostBody}>
              <div className={styles.face}>
                <div className={`${styles.eye} ${styles.eyeLeft}`}></div>
                <div className={`${styles.eye} ${styles.eyeRight}`}></div>
                <div className={styles.mouth}></div>
              </div>
            </div>
            <div className={styles.shadow}></div>
          </div>
        </div>
        
        <h1 className={styles.notFoundTitle}>404</h1>
        <h2 className={styles.notFoundSubtitle}>Oops! Page Not Found</h2>
        <p className={styles.notFoundDescription}>
          {customMessage || defaultMessage}
        </p>
        
        <button className={styles.homeButton} onClick={handleGoHome}>
          <span className={styles.buttonText}>{buttonText}</span>
          <span className={styles.buttonIcon}>→</span>
        </button>
        
        <div className={styles.notFoundStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>404</span>
            <span className={styles.statLabel}>Error Code</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>∞</span>
            <span className={styles.statLabel}>Possibilities</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1</span>
            <span className={styles.statLabel}>Home Button</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;