import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { hasActiveSession } from "../utils/auth";
import Loading from "../Components/Loading";
import toast from "react-hot-toast";
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from "lucide-react";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const loadOrder = async () => {
      if (!hasActiveSession()) {
        setError("Please login to view payment page.");
        setLoading(false);
        return;
      }

      if (!orderId) {
        setError("Order ID is required.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        const message =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load order.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const formatPrice = (value) =>
    typeof value === "number"
      ? value.toFixed(2)
      : Number(value || 0).toFixed(2);

  const getPaymentMethodDetails = (method) => {
    switch (method?.toLowerCase()) {
      case "bkash":
        return {
          name: "bKash",
          icon: "📱",
          description: "Pay using bKash wallet",
        };
      case "nagad":
        return {
          name: "Nagad",
          icon: "📲",
          description: "Pay using Nagad wallet",
        };
      case "rocket":
        return {
          name: "Rocket",
          icon: "🚀",
          description: "Pay using Rocket wallet",
        };
      case "card":
        return {
          name: "Credit/Debit Card",
          icon: "💳",
          description: "Pay using Visa, Mastercard, or Amex",
        };
      case "cod":
        return {
          name: "Cash on Delivery",
          icon: "💵",
          description: "Pay when you receive",
        };
      default:
        return { name: method || "Unknown", icon: "💰", description: "" };
    }
  };

  const handlePayment = async () => {
    const paymentMethod = order?.payment_method || order?.paymentMethod;

    if (!paymentMethod) {
      toast.error("No payment method found for this order");
      return;
    }

    // Handle COD separately
    if (paymentMethod.toLowerCase() === "cod") {
      try {
        await api.post("/payments/initiate", {
          orderId: orderId,
          paymentMethod: paymentMethod,
        });
        toast.success("Order confirmed with Cash on Delivery!");
        navigate("/orders");
      } catch (err) {
        toast.error("Failed to confirm order");
      }
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Call initiate to update order status to "processing"
      await api.post("/payments/initiate", {
        orderId: orderId,
        paymentMethod: paymentMethod,
      });

      // Step 2: Redirect to the process endpoint (no auth needed)
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://multi-vendor-e-commerce-platform-4vxy.onrender.com/api" ||
        "http://localhost:3000/api";
      const processUrl = `${baseUrl}/payments/process/${orderId}?paymentMethod=${paymentMethod}`;

      // Use window.location to allow the redirect to happen naturally
      window.location.href = processUrl;
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to process payment.";
      toast.error(message);
      console.error("Payment processing error:", err);
      setProcessing(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-[70vh] mx-6 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <Link
            to="/orders"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] mx-6 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <p className="text-slate-600">Order not found.</p>
          <Link
            to="/orders"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const paymentMethod = order?.payment_method || order?.paymentMethod;

  // Handle case where payment is already completed
  if (
    order?.payment_status === "completed" ||
    order?.payment_status === "paid"
  ) {
    return (
      <div className="min-h-[70vh] mx-6 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <p className="text-green-600 font-semibold text-lg">
            Payment already completed!
          </p>
          <Link
            to="/orders"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const paymentMethodDetails = getPaymentMethodDetails(paymentMethod);
  const isCOD = paymentMethod?.toLowerCase() === "cod";

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/orders"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-semibold text-slate-800">
            Complete Payment
          </h1>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Order ID</span>
              <span className="font-medium text-slate-800">#{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Status</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                {order.payment_status === "pending"
                  ? "Awaiting Payment"
                  : order.payment_status || "Pending"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold text-slate-800">
                Total
              </span>
              <span className="text-lg font-bold text-green-600">
                ${formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Pre-selected Payment Method */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Payment Method
          </h2>

          {!paymentMethod ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              No payment method found. Please contact support.
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-3xl">{paymentMethodDetails.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800">
                  {paymentMethodDetails.name}
                </p>
                <p className="text-sm text-slate-500">
                  {paymentMethodDetails.description}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          )}

          {/* Pay Button */}
          <button
            type="button"
            onClick={handlePayment}
            disabled={!paymentMethod || processing}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : isCOD ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirm Order
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ${formatPrice(order.total_amount)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
