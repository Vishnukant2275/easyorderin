import React, { useState } from "react";
import styles from "./FAQSection.module.css";

const FAQSection = () => {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Scan the restaurant's QR, browse the menu, add items to cart, and confirm your order. The restaurant receives it instantly.",
      category: "ordering"
    },
    {
      q: "Do I need to install any app?",
      a: "No. EasyOrderIn works fully on the browser — fast, simple, and app-free.",
      category: "general"
    },
    {
      q: "What payment methods are supported?",
      a: "UPI, cards, net banking, and wallets through Razorpay.",
      category: "payments"
    },
    {
      q: "Does EasyOrderIn charge restaurants?",
      a: "No. Restaurants get all features for free. Commission is charged from customers only.",
      category: "restaurants"
    },
    {
      q: "Can customers cancel their order?",
      a: "Orders can be cancelled within 1 minute. After that, restaurants may have already started preparing food.",
      category: "ordering"
    },
    {
      q: "How fast is settlement to restaurants?",
      a: "Instant. Payments are auto-split — restaurant receives their share immediately.",
      category: "restaurants"
    },
    {
      q: "Is my data safe?",
      a: "Yes. We use encryption and secure sessions for all sensitive data.",
      category: "security"
    },
    {
      q: "How to contact support?",
      a: "You can reach us through the Contact Us page. We respond within 1-48 hours.",
      category: "support"
    },
    {
      q: "Can I modify my order after placing it?",
      a: "Modifications can only be made within the 1-minute cancellation window. After that, please contact the restaurant directly.",
      category: "ordering"
    },
    {
      q: "Is there a minimum order value?",
      a: "This depends on the individual restaurant's policy. You'll see any minimum order requirements before checkout.",
      category: "ordering"
    }
  ];

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "ordering", name: "Ordering" },
    { id: "payments", name: "Payments" },
    { id: "restaurants", name: "For Restaurants" },
    { id: "security", name: "Security" },
    { id: "support", name: "Support" }
  ];

  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className={styles.section} id="faqs">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Find quick answers to common questions about EasyOrderIn
          </p>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className={styles.categoryFilters}>
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${
                activeCategory === category.id ? styles.active : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className={styles.faqContainer}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => (
              <div 
                key={index} 
                className={`${styles.faqCard} ${
                  openIndex === index ? styles.active : ""
                }`}
              >
                <button
                  className={styles.question}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className={styles.questionText}>{item.q}</span>
                  <span className={styles.icon}>
                    <svg 
                      className={`${styles.iconSvg} ${
                        openIndex === index ? styles.rotate : ""
                      }`}
                      width="20" 
                      height="20" 
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M10 15.5a1 1 0 01-.707-.293l-5-5a1 1 0 111.414-1.414L10 13.086l4.293-4.293a1 1 0 111.414 1.414l-5 5A1 1 0 0110 15.5z"
                      />
                    </svg>
                  </span>
                </button>

                <div 
                  className={`${styles.answer} ${
                    openIndex === index ? styles.open : ""
                  }`}
                  aria-hidden={openIndex !== index}
                >
                  <div className={styles.answerContent}>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No questions found matching your search.</p>
              <button 
                className={styles.clearFilters}
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className={styles.helpSection}>
          <div className={styles.helpCard}>
            <h3>Still have questions?</h3>
            <p>Can't find the answer you're looking for? Please reach out to our friendly team.</p>
            <div className={styles.helpActions}>
              <button className={styles.contactButton}>Contact Support</button>
              <button className={styles.emailButton}>Email Us</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;