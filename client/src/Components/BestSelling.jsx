import { useState } from "react";
import Title from "./Title";
import { api } from "../utils/api";
import { useEffect } from "react";
import ProductCard from "./ProductCard";
import Loading from "./Loading";

const BestSelling = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchBestSelling = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get("/products/public/best");
      console.log(response.data);
      setBestSellingProducts(response.data.products);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSelling();
  }, []);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <Title title="Best Selling" description="Showing 8 of 12 products" />
      <div className="mt-12">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center text-red-600">
            Failed to load products. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSelling;
