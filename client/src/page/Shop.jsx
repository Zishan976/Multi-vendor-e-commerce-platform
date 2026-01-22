import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../store/slices/productsSlice";
import Loading from "../Components/Loading";
import ProductCard from "../Components/ProductCard";
import Pagination from "../Components/Pagination";

const Shop = () => {
  const dispatch = useDispatch();
  const { products, pagination, loading, error } = useSelector(
    (state) => state.products,
  );
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("category_id") || "";
    dispatch(fetchProducts({ page: 1, search, categoryId }));
  }, [searchParams, dispatch]);

  const handlePageChange = (page) => {
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("category_id") || "";
    dispatch(fetchProducts({ page, search, categoryId }));
  };

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
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default Shop;
