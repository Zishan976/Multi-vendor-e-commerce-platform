import { useState } from "react";

import ProfileSection from "../Components/ProfileSection";
import ProductsSection from "../Components/ProductsSection";
import OrdersSection from "../Components/OrdersSection";
import DashboardStats from "../Components/DashboardStats";
import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { isVendor } from "../utils/auth";

const Seller = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const activatebuttons = ["dashboard", "profile", "products", "orders"];

  // If not vendor, show access denied message
  if (!isVendor()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <TriangleAlert className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-gray-600">
              You are not a vendor. You don't have permission to access this
              page.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Go Back
          </button>
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
      {activeTab === "dashboard" && <DashboardStats />}
      {activeTab === "profile" && <ProfileSection />}
      {activeTab === "products" && <ProductsSection />}
      {activeTab === "orders" && <OrdersSection />}
    </div>
  );
};

export default Seller;
