import { Routes, Route } from "react-router-dom";
import React from "react";
import Policy from "../layouts/Policy";
import PrivacyPolicy from "../pages/Policy/PrivacyPolicy";
import TermsAndConditions from "../pages/Policy/TermsConditions";
import ContactUs from "../pages/Policy/ContactUs";
import RefundPolicy from "../pages/Policy/RefundPolicy";
import CookiePolicy from "../pages/Policy/CookiePolicy";
import SecurityPolicy from "../pages/Policy/SecurityPolicy";
import PageNotFound from "../pages/PageNotFound";

const PolicyRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Policy />}>
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="security-policy" element={<SecurityPolicy />} />

        <Route
          path="*"
          element={<PageNotFound homeUrl="/" buttonText="Go to Home Page" />}
        />
      </Route>
    </Routes>
  );
};

export default PolicyRouter;
