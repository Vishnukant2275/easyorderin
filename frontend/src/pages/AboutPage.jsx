import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import VideoSection from "../components/VideoSection";
import TestimonialsSection from "../components/TestimonialsSection";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import "../../src/App.css";
function AboutPage() {
  return (
    <>
      <section id="home">
        <HeroSection />
      </section>

      <section id="features">
        <FeaturesSection />
      </section>
      <section id="pricing">
        <PricingSection />
      </section>
      <section id="howitworks">
        <HowItWorksSection />
        <section id="video">
          <VideoSection />
        </section>
      </section>
      <TestimonialsSection />

      <section id="faqs">
        <FAQSection />
      </section>
    </>
  );
}

export default AboutPage;
