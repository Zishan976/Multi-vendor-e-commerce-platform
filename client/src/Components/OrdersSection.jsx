import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import Loading from "./Loading";
import { RefreshCcw } from "lucide-react";

const OrdersSection = ({
  orders,
  paginationOfOrders,
  fetchOrders,
  loadingOrders,
  setSuccess,
  errorOrders,
}) => {
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    setError(errorOrders);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      setError(null);
      await api.put(`/vendor/orders/${orderId}/status`, { status: newStatus });
      setSuccess("Order status updated successfully.");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-green-600 pb-2">
          My Orders
        </h2>
        <button
          onClick={fetchOrders}
          disabled={loadingOrders}
          className="md:px-4 md:py-2 px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw
            className={`w-4 h-4 md:w-6 md:h-6 ${loadingOrders ? "animate-spin-reverse" : ""}`}
          />
        </button>
      </div>
      {error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {error}
        </div>
      ) : loadingOrders ? (
        <Loading />
      ) : orders.length === 0 ? (
        <div className="text-gray-600">No orders found.</div>
      ) : (
        <div className="space-y-4 mb-5">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Order #{order.id}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <p className="text-gray-600">
                  <strong>Customer:</strong> {order.customer_name}
                </p>
                <p className="text-gray-600">
                  <strong>Total:</strong> ${order.total_amount}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                disabled={updating === order.id}
                className="mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {updating === order.id && (
                <div className="text-blue-600 text-sm mt-2">
                  <span className="animate-spin inline-block mr-2">⟳</span>{" "}
                  Updating...
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-2">Order Items:</h4>
                {order.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="text-sm text-gray-600 mb-1"
                  >
                    {item.product_name} - Qty: {item.quantity} - $
                    {item.item_total}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {paginationOfOrders.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          {paginationOfOrders.hasPrev && (
            <button
              onClick={() => fetchOrders(paginationOfOrders.currentPage - 1)}
              className="px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded hover:bg-blue-600 hover:text-white transition-colors"
            >
              Previous
            </button>
          )}
          <span className="font-medium text-gray-600">
            Page {paginationOfOrders.currentPage} of{" "}
            {paginationOfOrders.totalPages}
          </span>
          {paginationOfOrders.hasNext && (
            <button
              onClick={() => fetchOrders(paginationOfOrders.currentPage + 1)}
              className="px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded hover:bg-blue-600 hover:text-white transition-colors"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
