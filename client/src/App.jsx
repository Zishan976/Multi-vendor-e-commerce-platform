import Hero from "./Components/Hero";
import LatestProducts from "./Components/LatestProducts";
import Navbar from "./Components/Navbar";
import Offer from "./Components/Offer";

export default function App() {
  return (
    <div>
      <Offer />
      <Navbar />
      <Hero />
      <LatestProducts />
    </div>
  );
}
