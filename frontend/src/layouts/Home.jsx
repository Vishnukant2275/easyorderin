import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
const Home = () => {
  return (
    <div style={{ display: "block", flexDirection: "row", width: "100%" }}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Home;
