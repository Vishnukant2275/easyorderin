import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from "../pages/AboutPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
