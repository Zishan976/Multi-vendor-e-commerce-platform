import { useEffect, useState } from "react";
import { ShoppingCart, Menu } from "lucide-react";
import Filter from "./Filter";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <nav className="bg-white shadow-md text-slate-600 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/">
            <div
              className="text-2xl sm:text-3xl font-bold text-green-600 font-serif italic tracking-wide flex items-center"
              style={{
                fontFamily:
                  "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Swift<span className="text-blue-900">Cart</span>
              <span className="text-4xl leading-none">.</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
            <li className="hover:text-green-600 cursor-pointer">Home</li>
            <li className="hover:text-green-600 cursor-pointer">Shop</li>
            <li className="border-b-2 border-green-500 cursor-pointer">
              Seller
            </li>
            <li className="border-b-2 border-green-500 cursor-pointer">
              Admin
            </li>
          </ul>

          <div className="flex gap-1">
            <input
              type="text"
              placeholder="Search products"
              className="hidden lg:inline px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="hidden lg:inline px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cart + Login (Always Visible) */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                9
              </span>
            </div>
            <button className="bg-green-600 text-white md:px-4 md:py-2 px-2 py-1 rounded md:text-base text-sm hover:bg-green-700 transition">
              Login
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-gray-700 ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 space-y-3 px-2">
            <ul className="space-y-2 text-gray-700 font-medium">
              <li className="hover:text-green-600 cursor-pointer">Home</li>
              <li className="hover:text-green-600 cursor-pointer">Shop</li>
              <li className="border-b-2 border-green-500 cursor-pointer">
                Seller
              </li>
              <li className="border-b-2 border-green-500 cursor-pointer">
                Admin
              </li>
            </ul>
          </div>
        )}
      </nav>
      <Filter />
    </>
  );
};

export default Navbar;
