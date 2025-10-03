import React from "react";

function FeaturesSection() {
  return (
    <div className="container px-4 py-5" id="custom-cards">
      <h2 className="pb-2 border-bottom text-center fw-bold">Amazing Features</h2>
      <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
        
        {/* Card 1 */}
        <div className="col">
          <div
            className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1600147131759-880e94a6185f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cXIlMjBjb2RlfGVufDB8fDB8fHww')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="d-flex flex-column h-100 p-5 pb-3 text-white">
              <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold text-warning">
                Unique QR Codes for Every Table
              </h2>
              <p className="fs-5 text-light">
                Each table in your restaurant gets its own QR code, making it simple for
                customers to browse menus and place orders instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col">
          <div
            className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuYWdlbWVudHxlbnwwfHwwfHx8MA%3D%3D')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="d-flex flex-column h-100 p-5 pb-3 text-white">
              <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold text-warning">
                Smart Order Management
              </h2>
              <p className="fs-5 text-light">
                Let our system handle your orders seamlessly. Focus on great service while 
                we streamline the order-taking process.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col">
          <div
            className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGF0YXxlbnwwfHwwfHx8MA%3D%3D')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="d-flex flex-column h-100 p-5 pb-3 text-white">
              <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold text-warning">
                Data-Driven Customer Insights
              </h2>
              <p className="fs-5 text-light">
                Track daily orders and gain valuable insights about your customers' 
                preferences to grow your restaurant smarter.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FeaturesSection;
