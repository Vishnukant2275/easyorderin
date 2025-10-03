import React from "react";

function PricingSection() {
  return (
    <section className="py-5 text-center">
      <div className="container">
        <h2 className="mb-4">Pricing</h2>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card p-4">
              <h5>Basic</h5>
              <p>$0 - Free trial</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card p-4">
              <h5>Standard</h5>
              <p>$9.99/month - Most popular</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card p-4">
              <h5>Premium</h5>
              <p>$19.99/month - All features</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
