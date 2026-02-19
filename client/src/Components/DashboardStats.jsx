import { RefreshCcw } from "lucide-react";

const DashboardStats = ({
  fetchStats,
  loadingStats,
  totalProducts,
  totalOrders,
  totalRevenue,
  pendingOrders,
  error,
}) => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm md:text-2xl font-bold text-gray-800 border-b-2 border-green-600 pb-2">
          Dashboard Overview
        </h2>
        <button
          onClick={fetchStats}
          disabled={loadingStats}
          className="px-2 py-1 md:px-4 md:py-2 bg-gray-400 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw
            className={`w-4 h-4 md:w-6 md:h-6 ${loadingStats ? "animate-spin-reverse" : ""}`}
          />
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold text-blue-600 mb-2">
            {totalProducts}
          </h3>
          <p className="text-gray-600 font-medium">Total Products</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold text-blue-600 mb-2">
            {totalOrders}
          </h3>
          <p className="text-gray-600 font-medium">Total Orders</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold text-green-600 mb-2">
            ${totalRevenue}
          </h3>
          <p className="text-gray-600 font-medium">Total Revenue</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold text-orange-600 mb-2">
            {pendingOrders}
          </h3>
          <p className="text-gray-600 font-medium">Pending Orders</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
