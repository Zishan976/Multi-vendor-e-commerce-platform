import Offer from "./Offer";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <Offer />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppLayout;
