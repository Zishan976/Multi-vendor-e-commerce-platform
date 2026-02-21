import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { hasActiveSession } from "../utils/auth";
import Loading from "../Components/Loading";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ShoppingCart,
  Trash2,
  MapPin,
  Tag,
  Truck,
} from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const refreshCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data.cart);
      setDiscountAmount(0); // Reset discount when cart contents change so total stays correct
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to load cart.";
      setError(message);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      if (!hasActiveSession()) {
        setError("Please login to view your cart.");
        setLoading(false);
        return;
      }
      try {
        await refreshCart();
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (!item?.id) return;

    const qty = Number(newQuantity);
    if (Number.isNaN(qty)) return;

    if (qty < 1) {
      // If quantity goes below 1, treat as remove
      await handleRemoveItem(item.id);
      return;
    }

    setUpdatingItemId(item.id);
    try {
      await api.put(`/cart/items/${item.id}`, { quantity: qty });
      await refreshCart();
      toast.success("Cart updated");
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to update item";
      toast.error(message);
      console.error("Update cart item failed:", err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!itemId) return;
    setRemovingItemId(itemId);
    try {
      await api.delete(`/cart/items/${itemId}`);
      await refreshCart();
      toast.success("Item removed from cart");
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to remove item";
      toast.error(message);
      console.error("Remove cart item failed:", err);
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleClearCart = async () => {
    setClearing(true);
    try {
      await api.delete("/cart");
      await refreshCart();
      toast.success("Cart cleared");
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to clear cart";
      toast.error(message);
      console.error("Clear cart failed:", err);
    } finally {
      setClearing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    try {
      const subtotal = Number(cart?.totalAmount) || 0;
      const response = await api.post("/coupons/apply", {
        code: couponCode.trim(),
        subtotal,
      });
      const {
        discountAmount: amount,
        discountPercent,
        message,
      } = response.data;
      setDiscountAmount(amount ?? 0);
      toast.success(
        message ||
          (discountPercent
            ? `${discountPercent}% off applied`
            : "Coupon applied"),
      );
    } catch (err) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to apply coupon";

      // Fallback: if backend is unreachable or returns 5xx, use client-side mock
      const useFallback = !err?.response || status >= 500;
      const validCoupons = { SAVE10: 10, SAVE20: 20, WELCOME: 15 };
      const percent = validCoupons[couponCode.toUpperCase()];

      if (useFallback && percent) {
        const subtotal = Number(cart?.totalAmount) || 0;
        const discountValue = (subtotal * percent) / 100;
        setDiscountAmount(discountValue);
        toast.success(`Coupon applied! ${percent}% discount`);
      } else if (useFallback && !percent) {
        setDiscountAmount(0);
        toast.error("Invalid coupon code");
      } else {
        toast.error(message);
        setDiscountAmount(0);
      }
    } finally {
      setApplyingCoupon(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = Number(cart?.totalAmount) || 0;
    const shipping = 0; // Free shipping
    const discount = discountAmount || 0;
    const total = subtotal + shipping - discount;
    return Math.max(0, total); // Ensure total is not negative
  };

  const handleProceedToCheckout = async () => {
    if (!address.trim() || !paymentMethod) return;
    setCheckingOut(true);
    try {
      const response = await api.post("/orders", {
        shipping_address: address.trim(),
        payment_method: paymentMethod,
        discount_amount: discountAmount || 0,
      });
      const orderId = response.data?.orderId;
      toast.success(
        orderId
          ? `Order #${orderId} placed successfully`
          : "Order placed successfully",
      );
      navigate("/orders", { state: { orderSuccess: true, orderId } });
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to place order.";
      toast.error(message);
    } finally {
      setCheckingOut(false);
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] mx-6 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <ShoppingCart className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-700">
            Your cart is empty
          </h1>
          <p className="text-slate-500">
            Browse our products and add items to your cart.
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

  const formatPrice = (value) =>
    typeof value === "number"
      ? value.toFixed(2)
      : Number(value || 0).toFixed(2);

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center border border-gray-200 rounded-lg p-4"
              >
                <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-h-24 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <Link
                    to={`/product/${item.product_id}`}
                    className="text-slate-800 font-medium hover:text-green-700 transition"
                  >
                    {item.name}
                  </Link>
                  {item.vendor_name && (
                    <p className="text-xs text-slate-500">
                      Sold by:{" "}
                      <span className="font-medium">{item.vendor_name}</span>
                    </p>
                  )}
                  <p className="text-sm text-slate-600">
                    Price: ${formatPrice(item.price)}
                  </p>
                  <div className="text-sm text-slate-600">
                    <span className="mr-2">Quantity:</span>
                    <div className="inline-flex items-center border border-gray-300 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity - 1)
                        }
                        disabled={
                          updatingItemId === item.id ||
                          removingItemId === item.id
                        }
                        className="px-2 py-1 text-sm text-slate-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item, e.target.value)
                        }
                        disabled={
                          updatingItemId === item.id ||
                          removingItemId === item.id
                        }
                        className="w-12 text-center text-sm py-1 outline-none"
                        aria-label="Item quantity"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity + 1)
                        }
                        disabled={
                          updatingItemId === item.id ||
                          removingItemId === item.id
                        }
                        className="px-2 py-1 text-sm text-slate-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-lg font-semibold text-slate-800">
                    $
                    {formatPrice(
                      (Number(item.price) || 0) * (Number(item.quantity) || 0),
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={
                      updatingItemId === item.id || removingItemId === item.id
                    }
                    className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-1 justify-end"
                  >
                    {removingItemId === item.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-gray-200 rounded-lg p-4 h-fit space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Order Summary
            </h2>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your shipping address"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select payment method</option>
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            {/* Coupon Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition"
                >
                  {applyingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
            </div>

            {/* Order Summary Breakdown */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${formatPrice(cart.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Shipping
                </span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-slate-800">
                  <span>Total</span>
                  <span>${formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Taxes calculated at checkout.
            </p>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={clearing}
              className="w-full text-sm text-red-600 border border-red-200 py-2 rounded hover:bg-red-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {clearing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Clearing cart...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={!paymentMethod || !address.trim() || checkingOut}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {checkingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing order...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Proceed to Checkout
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
