import { useEffect, useState } from "react";
import { ShoppingCart, Menu, LogOut } from "lucide-react";
import Filter from "./Filter";
import { api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { isAuthenticated, getUserFromToken } from "../utils/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedCategory) params.set("category_id", selectedCategory);
    navigate(`/shop?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (categoryId) params.set("category_id", categoryId);
    navigate(`/shop?${params.toString()}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        const userData = getUserFromToken();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    const userData = getUserFromToken();
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md text-slate-600 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-4xl font-semibold text-green-600">
            Swift<span className="text-blue-900">Cart</span>
            <span className="text-4xl leading-none">.</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
            <li className="hover:text-green-600 cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-green-600 cursor-pointer">
              <Link to="/shop">Shop</Link>
            </li>
            <li className="border-b-2 border-green-500 cursor-pointer">
              <Link to="/seller">Seller</Link>
            </li>
            <li className="border-b-2 border-green-500 cursor-pointer">
              <Link to="/admin">Admin</Link>
            </li>
          </ul>

          <div className="flex gap-1">
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="hidden lg:inline px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
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

          {/* Cart + Auth (Always Visible) */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                9
              </span>
            </div>
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm md:text-base">
                  Welcome, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white md:px-4 md:py-2 px-2 py-1 rounded md:text-base text-sm hover:bg-red-700 transition flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 text-white md:px-4 md:py-2 px-2 py-1 rounded md:text-base text-sm hover:bg-green-700 transition"
              >
                Login
              </button>
            )}

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
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Navbar;
