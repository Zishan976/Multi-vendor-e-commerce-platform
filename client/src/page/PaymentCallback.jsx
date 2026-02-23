import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const paymentStatus = searchParams.get("status");
    const message = searchParams.get("message");

    if (!orderId) {
      setStatus("error");
      return;
    }

    if (paymentStatus === "completed") {
      setStatus("success");
    } else if (paymentStatus === "failed") {
      setStatus("failed");
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto" />
          <p className="text-slate-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center mx-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-600 mb-6">
            Your payment has been processed successfully. You can view your
            order details in the orders page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              View Orders
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-5 py-2 rounded-lg hover:bg-slate-200 transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center mx-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-slate-600 mb-6">
            Your payment could not be processed. Please try again or use a
            different payment method.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Try Again
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-5 py-2 rounded-lg hover:bg-slate-200 transition"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center mx-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Something Went Wrong
        </h1>
        <p className="text-slate-600 mb-6">
          An error occurred while processing your payment. Please contact
          support if the problem persists.
        </p>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentCallback;
