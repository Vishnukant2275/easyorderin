import React, { useState, useEffect } from "react";
import "../styles/RestoLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaLock, FaUtensils } from "react-icons/fa"; // Import icons

const RestoLogIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [backgroundImage, setBackgroundImage] = useState("");

  // Array of background images
  const images = [
    "https://images.unsplash.com/photo-1487088678257-3a541e6e3922?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fExPR0lOfGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1681487916420-8f50a06eb60e?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8TE9HSU58ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fExPR0lOfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TE9HSU58ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1720192861639-1524439fc166?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TE9HSU58ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8TE9HSU58ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fExPR0lOfGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1670601440146-3b33dfcd7e17?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1667870036406-631ee715b494?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2xhc3NpY3xlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1516771317026-14d76f5396e5?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNsYXNzaWN8ZW58MHx8MHx8fDA%3D",
  ];

  // Pick random image on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setBackgroundImage(images[randomIndex]);
  }, []);

  // Existing handleSubmit function remains the same
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/restaurant/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Email and password matched successfully");
        window.location.href = "/dashboard";
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="login-box">
        <div className="logo-container"></div>
        <FaUtensils className="logo-icon" />
      </div>
      <h2>Restaurant Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="input-icon-wrapper">
            <FaUser className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-icon-wrapper">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
      <p className="forgot-password btn btn-light">
        <a href="#">Forgot Password?</a>
      </p>
    </div>
  );
};

export default RestoLogIn;
