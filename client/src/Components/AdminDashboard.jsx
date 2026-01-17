import React from "react";
import AdminDashboardCount from "./AdminDashboardCount";
import { RefreshCcw } from "lucide-react";

const AdminDashboard = ({
  fetchStats,
  loadingStats,
  totalUsers,
  pendingVendorsCount,
  approvedVendorsCount,
  errorDashboard,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-6 my-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <button
          onClick={fetchStats}
          disabled={loadingStats}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw className={loadingStats ? "animate-spin" : ""} />
        </button>
      </div>
      {errorDashboard && (
        <div className="text-red-600 mb-4">{errorDashboard}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <AdminDashboardCount
          title="Total Users"
          count={totalUsers}
          color="text-blue-600"
        />
        <AdminDashboardCount
          title="Pending Vendors"
          count={pendingVendorsCount}
          color="text-yellow-600"
        />
        <AdminDashboardCount
          title="Approved Vendors"
          count={approvedVendorsCount}
          color="text-green-600"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
