import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../store/slices/productsSlice";
import Loading from "../Components/Loading";
import ProductCard from "../Components/ProductCard";
import Pagination from "../Components/Pagination";
import { api } from "../utils/api";
import { MoveLeft } from "lucide-react";

const StoreDetail = () => {
  const { vendorId } = useParams();
  const dispatch = useDispatch();
  const { products, pagination, loading, error } = useSelector(
    (state) => state.products,
  );
  const [vendor, setVendor] = useState(null);
  const [loadingVendor, setLoadingVendor] = useState(true);
  const [errorVendor, setErrorVendor] = useState(null);
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoadingVendor(true);
        setErrorVendor(null);
        const response = await api.get(`/vendor/profile/${vendorId}`);
        setVendor(response.data);
      } catch (error) {
        console.error("Error fetching vendor:", error);
        setErrorVendor("Failed to load vendor details. Please try again.");
      } finally {
        setLoadingVendor(false);
      }
    };

    if (vendorId) {
      fetchVendor();
      dispatch(fetchProducts({ page: 1, vendorId }));
    }
  }, [vendorId, dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchProducts({ page, vendorId }));
  };

  if (loadingVendor) return <Loading />;
  if (errorVendor)
    return <div className="text-center text-red-600">Error: {errorVendor}</div>;
  if (!vendor) return <div className="text-center">Store not found</div>;

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto py-8">
        <MoveLeft
          onClick={handleGoBack}
          className="cursor-pointer transform hover:text-green-700 hover:scale-110 transition duration-200"
        />
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            {vendor.business_name}
          </h1>
          <p className="text-gray-600 text-lg">{vendor.business_description}</p>
        </div>

        {/* Products Section */}
        <h2 className="text-lg md:text-2xl text-slate-500 my-6 flex items-center gap-2">
          Products from{" "}
          <span className="text-slate-700 font-medium">
            {vendor.business_name}
          </span>
        </h2>
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

export default StoreDetail;
