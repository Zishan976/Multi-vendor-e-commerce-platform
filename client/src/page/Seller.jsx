import { useEffect, useState } from "react";

import ProfileSection from "../Components/ProfileSection";
import ProductsSection from "../Components/ProductsSection";
import OrdersSection from "../Components/OrdersSection";
import DashboardStats from "../Components/DashboardStats";
// import { useNavigate } from "react-router-dom";
import { isVendor } from "../utils/auth";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

const Seller = () => {
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paginationOfOrders, setPaginationOfOrders] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [errorOrders, setErrorOrders] = useState("");
  const [errorProducts, setErrorProducts] = useState("");
  const [errorProfile, setErrorProfile] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [formData, setFormData] = useState({
    business_name: "",
    business_description: "",
  });

  useEffect(() => {
    // Check if user is vendor
    if (!isVendor()) {
      return; // Don't fetch data if not vendor
    }

    fetchStats();
    fetchProfile();
    fetchProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (success) {
      toast.success(success);
      setSuccess("");
    }
  }, [success]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoadingOrders(true);
      setErrorOrders(null);
      const response = await api.get(`/vendor/orders?page=${page}`);
      setOrders(response.data.orders);
      setPaginationOfOrders(response.data.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorOrders("Failed to load orders. Please try again.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setErrorProducts(null);
      const response = await api.get("/products/vendor");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorProducts("Failed to load products. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      setErrorProfile(null);
      const response = await api.get("/vendor/profile");
      setProfile(response.data);
      setFormData({
        business_name: response.data.business_name,
        business_description: response.data.business_description,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setErrorProfile("Failed to load profile. Please try again.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await api.get("/vendor/status");
      setStats(response.data);
      console.log("Admin stats:", response.data);
    } catch (error) {
      setError("Failed to fetch admin stats.");
    } finally {
      setLoadingStats(false);
    }
  };

  const activatebuttons = ["dashboard", "profile", "products", "orders"];

  // If not vendor, show access denied message
  if (!isVendor()) {
    return (
      // <div className="min-h-screen flex items-center justify-center bg-gray-50">
      //   <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      //     <div className="mb-6">
      //       <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
      //         <TriangleAlert className="h-8 w-8 text-red-600" />
      //       </div>
      //       <h2 className="mt-4 text-2xl font-bold text-gray-900">
      //         Access Denied
      //       </h2>
      //       <p className="mt-2 text-gray-600">
      //         You are not a vendor. You don't have permission to access this
      //         page.
      //       </p>
      //     </div>
      //     <button
      //       onClick={() => navigate(-1)}
      //       className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      //     >
      //       Go Back
      //     </button>
      //   </div>
      // </div>

      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You are not a vendor. You do not have permission to access this
            page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-5 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Vendor Dashboard
      </h1>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8 border-b-2 border-gray-200">
        {activatebuttons.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 text-lg font-medium  border-b-3  transition-all duration-300  ${
              activeTab === tab
                ? "text-green-600 border-green-600"
                : "text-gray-600 border-transparent hover:text-green-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <DashboardStats
          fetchStats={fetchStats}
          loadingStats={loadingStats}
          totalProducts={stats.totalProducts}
          totalOrders={stats.totalOrders}
          totalRevenue={stats.totalRevenue}
          pendingOrders={stats.pendingOrders}
          error={error}
        />
      )}
      {activeTab === "profile" && (
        <ProfileSection
          profile={profile}
          formData={formData}
          setFormData={setFormData}
          loadingProfile={loadingProfile}
          fetchProfile={fetchProfile}
          setSuccess={setSuccess}
          errorProfile={errorProfile}
        />
      )}
      {activeTab === "products" && (
        <ProductsSection
          products={products}
          loadingProducts={loadingProducts}
          fetchProducts={fetchProducts}
          errorProducts={errorProducts}
          setSuccess={setSuccess}
        />
      )}
      {activeTab === "orders" && (
        <OrdersSection
          orders={orders}
          paginationOfOrders={paginationOfOrders}
          fetchOrders={fetchOrders}
          loadingOrders={loadingOrders}
          setSuccess={setSuccess}
          errorOrders={errorOrders}
        />
      )}
      <Toaster />
    </div>
  );
};

export default Seller;
