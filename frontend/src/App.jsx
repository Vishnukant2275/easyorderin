import { useState, useEffect, use } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
//routers import
import Restaurantrouter from "./router/Restaurantrouter";
import UserRouter from "./router/UserRouter";

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import api from "./services/api";
import Home from "./layouts/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/restaurant/*" element={<Restaurantrouter />} />
          <Route path="/user/*" element={<UserRouter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
