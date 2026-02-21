import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { hasActiveSession } from "../utils/auth";
import Loading from "../Components/Loading";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      if (!hasActiveSession()) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/orders");
        setOrders(response.data.orders || []);
      } catch (err) {
        const message =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load orders.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatPrice = (value) =>
    typeof value === "number"
      ? value.toFixed(2)
      : Number(value || 0).toFixed(2);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method?.toLowerCase()) {
      case "cod":
        return "Cash on Delivery";
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "rocket":
        return "Rocket";
      case "card":
        return "Credit/Debit Card";
      default:
        return method || "N/A";
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-[70vh] mx-6 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <p className="text-red-600">{error}</p>
          {!hasActiveSession() && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Go to home
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[70vh] mx-6 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-700">
            No orders yet
          </h1>
          <p className="text-slate-500">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go to Shop
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-semibold text-slate-800">My Orders</h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* Order Header */}
              <div
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800">
                        Order #{order.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1) || "Pending"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.items?.length || 0} item(s)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-lg font-semibold text-slate-800">
                        ${formatPrice(order.total_amount)}
                      </p>
                    </div>
                    <div className="text-slate-400">
                      {expandedOrderId === order.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details - Expandable */}
              {expandedOrderId === order.id && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </h3>
                      <p className="text-sm text-slate-600 bg-gray-50 p-3 rounded">
                        {order.shipping_address || "No address provided"}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-slate-700 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Method
                      </h3>
                      <p className="text-sm text-slate-600 bg-gray-50 p-3 rounded">
                        {getPaymentMethodName(order.payment_method)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-6">
                    <h3 className="font-medium text-slate-700 mb-3">
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div
                          key={item.product_id || index}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-16 h-16 flex items-center justify-center bg-white rounded border border-gray-200 overflow-hidden">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.product_id}`}
                              className="font-medium text-slate-800 hover:text-green-600 transition"
                            >
                              {item.product_name || "Unknown Product"}
                            </Link>
                            {item.vendor_name && (
                              <p className="text-xs text-slate-500">
                                Sold by: {item.vendor_name}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                              <span>
                                Qty:{" "}
                                <span className="font-medium">
                                  {item.quantity}
                                </span>
                              </span>
                              <span>
                                Price:{" "}
                                <span className="font-medium">
                                  ${formatPrice(item.price)}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-slate-800">
                              $
                              {formatPrice(
                                (Number(item.price) || 0) *
                                  (Number(item.quantity) || 0),
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="text-slate-800 font-medium">
                        $
                        {formatPrice(
                          (Number(order.total_amount) || 0) +
                            (Number(order.discount_amount) || 0),
                        )}
                      </span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-slate-600">Discount</span>
                        <span className="text-green-600 font-medium">
                          -${formatPrice(order.discount_amount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-600">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                      <span className="font-semibold text-slate-800">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-slate-800">
                        ${formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
