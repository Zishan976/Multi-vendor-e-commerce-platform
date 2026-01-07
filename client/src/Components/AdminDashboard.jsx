import React from "react";
import AdminDashboardCount from "./AdminDashboardCount";

const AdminDashboard = ({
  totalUsers,
  pendingVendorsCount,
  approvedVendorsCount,
  success,
  error,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-6 my-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {success && <div className="text-green-600 mb-4">{success}</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
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
