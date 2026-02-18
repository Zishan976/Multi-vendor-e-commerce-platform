import { useEffect, useState } from "react";
import { ShoppingCart, Menu, LogOut } from "lucide-react";
import Filter from "./Filter";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import {
  hasActiveSession,
  getUserFromToken,
  clearTokens,
  getRefreshToken,
  isVendor,
  isAdmin,
} from "../utils/auth";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = hasActiveSession();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        const userData = getUserFromToken();
        setUser(userData);
        // Fetch cart count when user is authenticated
        fetchCartCount();
      } else {
        setCartCount(0);
      }
    };

    const fetchCartCount = async () => {
      try {
        const response = await api.get("/cart");
        const itemCount =
          response.data?.cart?.items?.reduce(
            (sum, item) => sum + item.quantity,
            0,
          ) || 0;
        setCartCount(itemCount);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        setCartCount(0);
      }
    };

    checkAuth();

    const handleTokenRefresh = () => checkAuth();
    const handleSessionEnded = () => checkAuth();

    window.addEventListener("tokenRefreshed", handleTokenRefresh);
    window.addEventListener("sessionEnded", handleSessionEnded);
    window.addEventListener("cartUpdated", fetchCartCount);

    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefresh);
      window.removeEventListener("sessionEnded", handleSessionEnded);
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, []);

  const handleLoginSuccess = () => {
    const userData = getUserFromToken();
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        // Call backend logout to revoke refresh token
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if backend call fails
    } finally {
      // Always clear tokens locally
      clearTokens();
      setUser(null);
      setIsLoggedIn(false);
      setLogoutLoading(false);
      toast.success("Logged out successfully");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md text-slate-600 px-4 py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-4xl font-semibold text-green-600"
          >
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
            {isVendor() && (
              <li className="border-b-2 border-green-500 cursor-pointer">
                <Link to="/seller">Seller</Link>
              </li>
            )}
            {isAdmin() && (
              <li className="border-b-2 border-green-500 cursor-pointer">
                <Link to="/admin">Admin</Link>
              </li>
            )}
          </ul>

          {/* Cart + Auth (Always Visible) */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full min-w-5 text-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="hidden lg:block text-gray-700 text-sm md:text-base">
                  Welcome, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="bg-red-600 text-white md:px-4 md:py-2 px-2 py-1 rounded md:text-base text-sm hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {logoutLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:inline bg-green-600 text-white md:px-4 md:py-2 px-2 py-1 rounded md:text-base text-sm hover:bg-green-700 transition"
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
              <li className="hover:text-green-600 cursor-pointer">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="hover:text-green-600 cursor-pointer">
                <Link to="/shop" onClick={() => setIsOpen(false)}>
                  Shop
                </Link>
              </li>
              {isVendor() && (
                <li className="border-b-2 border-green-500 cursor-pointer">
                  <Link to="/seller" onClick={() => setIsOpen(false)}>
                    Seller
                  </Link>
                </li>
              )}
              {isAdmin() && (
                <li className="border-b-2 border-green-500 cursor-pointer">
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    Admin
                  </Link>
                </li>
              )}
              <li>
                {isLoggedIn ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-700 text-sm">
                      Welcome, {user?.email}
                    </span>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      disabled={logoutLoading}
                      className="bg-red-600 text-white md:px-4 md:py-2 px-2 py-1 rounded md:text-base text-sm hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {logoutLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="bg-green-600 text-white md:px-4 md:py-2 px-2 py-1 rounded md:text-base text-sm hover:bg-green-700 transition"
                  >
                    Login
                  </button>
                )}
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
