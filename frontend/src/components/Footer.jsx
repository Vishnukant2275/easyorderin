import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: "/about#home", label: "Home" },
    { path: "/about#features", label: "Features" },
    { path: "/about#pricing", label: "Pricing" },
    { path: "/about#faqs", label: "FAQs" },
    { path: "/about#howitworks", label: "How It Works" },
    { path: "/policy/privacy-policy", label: "Privacy Policy" },
    { path: "/policy/terms-and-conditions", label: "Terms of Service" },
    { path: "/contact", label: "Contact" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF />, url: "http://www.facebook.com/easyorderin" },
    { name: "Instagram", icon: <FaInstagram />, url: "https://www.instagram.com/easyorderin" },
    { name: "Twitter", icon: <FaTwitter />, url: "http://www.x.com/easyorderin" },
    { name: "Youtube", icon: <FaYoutube />, url: "https://www.youtube.com/@easyorderin" }
    
  ];

  const handleScrollNavigation = (path, e) => {
    if (path.includes('#')) {
      e.preventDefault();
      const [basePath, hash] = path.split('#');
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Main Footer Content */}
        <div className={styles.mainFooter}>
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>EasyOrderIn</h3>
            <p className={styles.sectionDescription}>
              Transforming restaurant experiences with seamless QR code ordering solutions. 
              Join thousands of restaurants already using our platform.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={styles.socialLink}
                  aria-label={social.name}
                >
                  <span className={styles.socialIcon}>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.sectionSubtitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {footerLinks.slice(0, 4).map((link, index) => (
                <li key={index} className={styles.linkItem}>
                  {link.path.includes('#') ? (
                    <a
                      href={link.path}
                      className={styles.footerLink}
                      onClick={(e) => handleScrollNavigation(link.path, e)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.path} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.sectionSubtitle}>Support</h4>
            <ul className={styles.linkList}>
              {footerLinks.slice(4).map((link, index) => (
                <li key={index} className={styles.linkItem}>
                  {link.path.includes('#') ? (
                    <a
                      href={link.path}
                      className={styles.footerLink}
                      onClick={(e) => handleScrollNavigation(link.path, e)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.path} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.sectionSubtitle}>Contact Info</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <span>support@easyorderin.com</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>+916269977285</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>485226, Satna MP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={styles.bottomFooter}>
          <div className={styles.footerNav}>
            {footerLinks.slice(0, 5).map((link, index) => (
              <span key={index} className={styles.navItem}>
                {link.path.includes('#') ? (
                  <a
                    href={link.path}
                    className={styles.navLink}
                    onClick={(e) => handleScrollNavigation(link.path, e)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.path} className={styles.navLink}>
                    {link.label}
                  </Link>
                )}
              </span>
            ))}
          </div>
          
          <div className={styles.copyright}>
            <p className={styles.copyrightText}>
              © {currentYear} EasyOrderIn. All rights reserved.
            </p>
            <p className={styles.madeWith}>
              Made with <span className={styles.heart}>❤️</span> for restaurants
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;