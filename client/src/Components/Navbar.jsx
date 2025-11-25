import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md text-[#4c4b6f]">
      {/* Logo */}
      <div className="text-2xl font-bold text-green-600">
        gocart<span className="text-blue-900">.</span>
      </div>

      {/* Navigation Links */}
      <ul className="flex gap-6 text-gray-700 font-medium">
        <li className="hover:text-green-600 cursor-pointer">Home</li>
        <li className="hover:text-green-600 cursor-pointer">Shop</li>
        <li className="border-b-2 border-green-500 cursor-pointer">Seller</li>
        <li className="border-b-2 border-green-500  cursor-pointer">Admin</li>
      </ul>

      {/* Search + Cart + Login */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search products"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="relative">
          <ShoppingCart className="text-xl text-gray-700" />
          <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
            9
          </span>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
