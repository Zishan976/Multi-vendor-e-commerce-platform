import React from "react";

const AdminDashboardCount = ({ title, count, color }) => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className={`text-3xl font-bold ${color}`}>{count}</p>
      </div>
    </>
  );
};

export default AdminDashboardCount;
