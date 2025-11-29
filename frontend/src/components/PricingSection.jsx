import React, { useState } from "react";
import styles from "./PricingSection.module.css";

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const plans = [
    {
      title: "Free Plan",
      price: "₹0",
      period: "month",
      tagline: "Full access. Yes, everything. Seriously.",
      button: "Start Free (Obviously)",
      features: [
        "✓ Unlimited menu items",
        "✓ Order management",
        "✓ Customer analytics",
        "✓ Quick Customer support",
        "✓ No hidden fees",
      ],
      popular: false,
      highlight: true,
    },
    {
      title: "Standard",
      price: "₹739",
      period: "month",
      tagline: "You don't need this... free plan already gives everything 😂",
      button: "Why Though?",
      features: [
        
        "✓ Unlimited menu items",
        "✓ Order management",
        "✓ Customer analytics",
        "✓ Quick Customer support",
        "✓ No hidden fees"
      ],
      popular: false,
      highlight: false,
    },
    {
      title: "Premium",
      price: "₹1999",
      period: "month",
      tagline: "Why??? Seriously you want to purchage it even Everything is free? But okay as you wish...",
      button: "Buy For No Reason",
      features: [
        "✓ Unlimited menu items",
        "✓ Order management",
        "✓ Customer analytics",
         "✓ Quick Customer support",
        "✓ No hidden fees",
      ],
      popular: true,
      highlight: false,
    },
  ];

  const handlePlanSelect = (index) => {
    setSelectedPlan(index);
    // Add your plan selection logic here
    console.log(`Selected plan: ${plans[index].title}`);
  };

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Our Pricing Plans</h2>
          <p className={styles.subheading}>
            Choose the plan that makes you question why you'd pay at all 🤔
          </p>
        </div>

        <div className={styles.wrapper}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${styles.card} ${
                selectedPlan === index ? styles.cardSelected : ""
              } ${plan.popular ? styles.cardPopular : ""} ${
                plan.highlight ? styles.cardHighlight : ""
              }`}
              onClick={() => handlePlanSelect(index)}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>Most Confusing</div>
              )}

              {plan.highlight && (
                <div className={styles.highlightBadge}>Best Value</div>
              )}

              <div className={styles.cardHeader}>
                <h3 className={styles.title}>{plan.title}</h3>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>/{plan.period}</span>
                </div>
              </div>

              <p className={styles.tagline}>{plan.tagline}</p>

              <ul className={styles.features}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles.feature}>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.button} ${
                  selectedPlan === index ? styles.buttonSelected : ""
                } ${plan.popular ? styles.buttonPopular : ""}`}
                onClick={() => handlePlanSelect(index)}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.disclaimer}>
            💡 <strong>Pro Tip:</strong> The free plan actually gives you
            everything you need. We're just testing if anyone reads these
            footnotes!
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
