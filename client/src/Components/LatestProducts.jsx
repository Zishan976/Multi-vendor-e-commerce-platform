import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

const LatestProducts = () => {
  const fetchLatest = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/products/public/latest"
    );
    console.log(response.data);
  };
  useEffect(() => {
    fetchLatest();
  }, []);
  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <div class="flex flex-col items-center">
        <h2 class="text-2xl font-semibold text-slate-800">Latest Products</h2>
        <a
          class="flex items-center gap-5 text-sm text-slate-600 mt-2"
          href="/shop"
        >
          <p class="max-w-lg text-center">Showing 4 of 12 products</p>
          <button class="text-green-500 flex items-center gap-1">
            View more <ArrowRight className="w-4" />
          </button>
        </a>
      </div>
    </div>
  );
};

export default LatestProducts;
