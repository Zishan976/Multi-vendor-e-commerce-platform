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
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  const refreshCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data.cart);
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
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${formatPrice(cart.totalAmount)}</span>
            </div>
            <p className="text-xs text-slate-500">
              Shipping and taxes calculated at checkout.
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
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                Proceed to Checkout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
