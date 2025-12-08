import BestSelling from "../Components/BestSelling";
import Hero from "../Components/Hero";
import LatestProducts from "../Components/LatestProducts";
import NewsLetter from "../Components/NewsLetter";
import OurSpec from "../Components/OurSpec";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestProducts />
      <BestSelling />
      <OurSpec />
      <NewsLetter />
    </div>
  );
};

export default Home;
