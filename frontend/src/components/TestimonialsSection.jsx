import React from "react";
import "../styles/TestimonialsSection.css"; // You'll need to create this CSS file

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "https://randomuser.me /portraits/women/1.jpg",
      text: "The food quality and delivery service are exceptional! I've never been disappointed with my orders.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Food Enthusiast",
      image: "https://randomuser.me /portraits/men/2.jpg",
      text: "Best food ordering experience I've had. The variety of restaurants is amazing!",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      role: "Food Blogger",
      image: "https://randomuser.me /portraits/women/3.jpg",
      text: "I love how easy it is to order. The interface is user-friendly and the delivery is always on time.",
      rating: 4,
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="container py-5">
        <h2 className="text-center mb-5">What Our Customers Say</h2>
        <div className="row">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card">
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-content">
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
