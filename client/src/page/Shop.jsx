import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import Loading from "../Components/Loading";
import ProductCard from "../Components/ProductCard";
import Pagination from "../Components/Pagination";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();

  const fetchProducts = async (page = 1, search = "", categoryId = "") => {
    try {
      setLoading(true);
      setError(false);
      let url = `/products/public?page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (categoryId) url += `&category_id=${categoryId}`;
      const response = await api.get(url);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("category_id") || "";
    fetchProducts(currentPage, search, categoryId);
  }, [currentPage, searchParams]);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("category_id") || "";
    if (search || categoryId) {
      setCurrentPage(1);
    }
  }, [searchParams]);

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer">
          All <span className="text-slate-700 font-medium">Products</span>
        </h1>
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-center text-red-600">
              Failed to load products. Please try again.
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        <Pagination pagination={pagination} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default Shop;
