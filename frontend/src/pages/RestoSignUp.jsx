import React, { useState } from "react";
import "../styles/RestoSignUp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestoSignUp = () => {
  const [otpSent, setOtpSent] = useState(false); // to show/hide OTP input
  const [otp, setOtp] = useState(""); // to store entered OTP
  const [otpVerified, setOtpVerified] = useState(false); // to check verification status
  const [otpButtonText, setOtpButtonText] = useState("Send OTP");
  const [restaurant, setRestaurant] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    restaurantType: "",
    seatingCapacity: "",
    logoImage: null,
  });
  const sendOtp = async (e) => {
    e.preventDefault();
    const notify = () => toast.success("OTP sent successfully!");
    const otpNotSent = (error) =>
      toast.error(`Failed to send OTP. ${error || ""}`);

    try {
      const response = await fetch(
        `/api/restaurant/send-otp?email=${restaurant.email}`
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json(); // parse JSON from backend

      if (data.success) {
        setOtpSent(true);
        notify();
        setOtpButtonText("Resend Otp");
      } else {
        otpNotSent(data.message);
      }
    } catch (error) {
      otpNotSent(error.message);
    }
  };

  const verifyOtp = async () => {
    const otpVerifiedMsg = () => toast.success("OTP verified successfully!");
    const otpNotVerifiedMsg = (error) =>
      toast.error(`Failed to verify OTP. ${error || ""}`);

    try {
      const response = await fetch(
        `/api/restaurant/verify-otp?email=${restaurant.email}&otp=${otp}`
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        otpVerifiedMsg();
      } else {
        otpNotVerifiedMsg(data.message);
      }
    } catch (error) {
      otpNotVerifiedMsg(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // append all restaurant fields
      for (const key in restaurant) {
        formData.append(key, restaurant[key]);
      }

      const response = await fetch("/api/restaurant/register", {
        method: "POST",
        body: formData, // no Content-Type header → browser sets multipart/form-data
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Restaurant registered successfully!");
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="resto-signup-container ">
      <ToastContainer autoClose={3000} />
      <div className="resto-signup-card ">
        <h2 className="resto-signup-title">Restaurant Sign Up</h2>

        <form onSubmit={handleRegistration} className="space-y-4">
          {/* Restaurant Name */}
          <div className="">
            <label className="block mb-1 text-gray-700">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={restaurant.restaurantName}
              onChange={handleChange}
              placeholder="Enter restaurant name"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Owner's Name */}
          <div>
            <label className="block mb-1 text-gray-700">Owner's Name</label>
            <input
              type="text"
              name="ownerName"
              value={restaurant.ownerName}
              onChange={handleChange}
              placeholder="Enter owner's name"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={restaurant.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              disabled={otpVerified}
            />
          </div>
          {/* Send OTP Button renders only if email is valid*/}
          {/\S+@\S+\.\S+/.test(restaurant.email) && (
            <button
              className="otp-btn"
              disabled={!/\S+@\S+\.\S+/.test(restaurant.email) || otpVerified}
              onClick={sendOtp}
            >
              {!otpVerified ? otpButtonText : "✔️ Email Verified"}
            </button>
          )}
          {otpSent && !otpVerified && (
            <div>
              <label className="block mb-1 text-gray-700">Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button type="button" className="otp-btn" onClick={verifyOtp}>
                Verify OTP
              </button>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={restaurant.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Confirm Password */}
          {restaurant.password.length > 0 && (
            <div>
              <label className="block mb-1 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={restaurant.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          {/* Contact Number */}
          <div>
            <label className="block mb-1 text-gray-700">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={restaurant.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Address */}
          <div className="">
            <label className="block mb-1 text-gray-700">Address</label>
            <textarea
              name="address"
              value={restaurant.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              rows="3"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          {/* City, State, and Pincode in a grid */}
          <div className="resto-signup-grid">
            <div>
              <label className="block mb-1 text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={restaurant.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={restaurant.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Pincode</label>
              <input
                type="text"
                name="pinCode"
                value={restaurant.pinCode}
                onChange={handleChange}
                placeholder="Enter pincode"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Restaurant Type */}
          <div>
            <label className="block mb-1 text-gray-700">Restaurant Type</label>
            <select
              name="restaurantType"
              value={restaurant.restaurantType}
              onChange={handleChange}
              className="resto-signup-select"
            >
              <option value="" disabled>
                Select Restaurant Type
              </option>
              <option value="dineIn">Dine-In</option>
              <option value="takeAway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block mb-1 text-gray-700">Upload Logo</label>
            <input
              type="file"
              name="logoImage"
              onChange={handleChange}
              accept="image/*"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Seating Capacity */}
          <div>
            <label className="block mb-1 text-gray-700">Seating Capacity</label>
            <input
              type="number"
              name="seatingCapacity"
              value={restaurant.seatingCapacity}
              onChange={handleChange}
              placeholder="Enter seating capacity"
              min="1"
              max="50"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={!otpVerified}
            className="resto-signup-btn"
          >
            Register Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestoSignUp;
