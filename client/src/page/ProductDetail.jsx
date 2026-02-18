import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById } from "../store/slices/productsSlice";
import Loading from "../Components/Loading";
import { api } from "../utils/api";
import { hasActiveSession } from "../utils/auth";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CreditCard,
  Earth,
  MoveLeft,
  Tag,
  UserRound,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  function handleGoBack() {
    navigate(-1);
  }

  const handleAddToCart = async () => {
    if (!product?.id) return;

    if (!hasActiveSession()) {
      toast.error("Please login to add items to cart");
      return;
    }

    const maxQty =
      typeof product?.stock_quantity === "number" && product.stock_quantity > 0
        ? product.stock_quantity
        : 9999;
    const safeQty = Math.min(Math.max(Number(quantity) || 1, 1), maxQty);

    setAddToCartLoading(true);
    try {
      await api.post("/cart/items", { product_id: product.id, quantity: safeQty });
      toast.success("Added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to add to cart";
      toast.error(message);
      console.error("Add to cart failed:", err);
    } finally {
      setAddToCartLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    // Reset quantity when navigating to a new product
    setQuantity(1);
  }, [id]);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;
  if (!product) return <div className="text-center">Product not found</div>;

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-4xl mx-auto py-8">
        <button
          type="button"
          onClick={handleGoBack}
          aria-label="Go back"
          className="transform hover:text-green-700 hover:scale-110 transition duration-200"
        >
          <MoveLeft />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-5">
          <div className="bg-[#F5F5F5] h-96 rounded-lg flex items-center justify-center">
            <img
              className="max-h-80 w-auto"
              src={product.image_url}
              alt={product.name}
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-medium text-slate-800">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-slate-700">
              ${product.price}
            </p>
            <p className="my-9 text-gray-500 flex items-center gap-1">
              <Tag size={15} />
              <span>Save 42% right now</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Qty</span>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
                  disabled={addToCartLoading}
                  className="px-3 py-2 text-slate-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={
                    typeof product?.stock_quantity === "number"
                      ? product.stock_quantity
                      : undefined
                  }
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={addToCartLoading}
                  className="w-16 text-center py-2 outline-none"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  onClick={() => {
                    const max =
                      typeof product?.stock_quantity === "number" &&
                      product.stock_quantity > 0
                        ? product.stock_quantity
                        : 9999;
                    setQuantity((q) => Math.min(max, Number(q) + 1));
                  }}
                  disabled={addToCartLoading}
                  className="px-3 py-2 text-slate-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {typeof product?.stock_quantity === "number" && (
                <span className="text-xs text-slate-500">
                  In stock: {product.stock_quantity}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addToCartLoading}
              className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none"
            >
              {addToCartLoading ? "Adding..." : "Add to Cart"}
            </button>
            <hr className="border-gray-300 my-5" />
            <div>
              <div className="flex flex-col gap-4 text-slate-500">
                <p className="flex gap-3">
                  <Earth size={24} className="text-slate-400" />
                  Free shipping worldwide
                </p>
                <p className="flex gap-3">
                  <CreditCard size={24} className="text-slate-400" />
                  100% Secured Payment
                </p>
                <p className="flex gap-3">
                  <UserRound size={24} className="text-slate-400" />
                  Trusted by top brands
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-2xl py-5">
          <h1 className="text-slate-600 font-medium">Description</h1>
          <hr className="text-gray-200 my-4" />
          <p className="text-slate-600">{product.description}</p>
        </div>

        <div className="max-w-2xl py-5">
          <h1 className="text-slate-600 font-medium">Store</h1>
          <hr className="text-gray-200 my-4" />
          <Link to={`/store/${product.vendor_id}`}>
            <p className="text-slate-800">{product.vendor_name}</p>
            <p className="text-green-500 flex items-center gap-1">
              view store <ArrowRight size={15} />
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
