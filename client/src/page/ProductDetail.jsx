import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById } from "../store/slices/productsSlice";
import Loading from "../Components/Loading";
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

  function handleGoBack() {
    navigate(-1);
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;
  if (!product) return <div className="text-center">Product not found</div>;

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-4xl mx-auto py-8">
        <MoveLeft
          onClick={handleGoBack}
          className="cursor-pointer transform hover:text-green-700 hover:scale-110 transition duration-200"
        />
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
            {/* <div className="space-y-2"> */}
            {/* <p>
                <strong>Category:</strong> {product.category_name}
              </p> */}
            {/* <p>
                <strong>Vendor:</strong> {product.vendor_name}
              </p> */}
            {/* <p>
                <strong>Stock:</strong> {product.stock_quantity}
              </p> */}
            {/* <p>
                <strong>Status:</strong> {product.status}
              </p> */}
            {/* </div> */}
            <button className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition">
              Add to Cart
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
          <h1 className="text-slate-600 font-medium">Descripton</h1>
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
