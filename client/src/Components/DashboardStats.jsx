import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import Loading from "./Loading";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products count
      const productsResponse = await api.get("/products/vendor");
      const products = productsResponse.data;

      // Fetch orders
      const ordersResponse = await api.get("/vendor/orders?page=1&limit=1000");
      const orders = ordersResponse.data.orders;

      // Calculate stats
      const totalProducts = products.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount),
        0
      );
      const pendingOrders = orders.filter(
        (order) => order.status === "pending"
      ).length;

      setStats({
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        pendingOrders,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-blue-600 pb-2">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold text-blue-600 mb-2">
            {stats.totalProducts}
          </h3>
          <p className="text-gray-600 font-medium">Total Products</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold text-blue-600 mb-2">
            {stats.totalOrders}
          </h3>
          <p className="text-gray-600 font-medium">Total Orders</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold text-green-600 mb-2">
            ${stats.totalRevenue}
          </h3>
          <p className="text-gray-600 font-medium">Total Revenue</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold text-orange-600 mb-2">
            {stats.pendingOrders}
          </h3>
          <p className="text-gray-600 font-medium">Pending Orders</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
