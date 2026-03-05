import { useEffect } from "react";
import { api } from "../utils/api";
import { useState } from "react";
import ProductCard from "./ProductCard";
import Title from "./Title";
import Loading from "./Loading";

const LatestProducts = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchLatest = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get("/products/public/latest");
      setLatestProducts(response.data.products);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <Title
        title="Latest Products"
        description="Showing 4 of 12 products"
        href="/shop"
        visibleButton={!error && !loading}
      />
      <div className="mt-12">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center text-red-600">
            Failed to load products. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestProducts;
