import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // Fallback image if product image is missing or invalid
  const imageUrl = product.image_url || "/placeholder-product.png";

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/150?text=No+Image";
  };

  return (
    <Link className=" group max-xl:mx-auto" to={`/product/${product.id}`}>
      <div className="bg-[#F5F5F5] h-40  sm:w-60 sm:h-68 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          className="max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300"
          src={imageUrl}
          alt={product.name}
          onError={handleImageError}
        />
      </div>
      <div className="flex justify-between gap-3 text-sm font-medium text-slate-800 pt-2 max-w-60">
        <div>
          <p className="truncate">{product.name}</p>
        </div>
        <p>${product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
