import Offer from "./Offer";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AppLayout = () => {
  return (
    <div>
      <Offer />
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster />
    </div>
  );
};

export default AppLayout;
