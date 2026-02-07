import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

const Filter = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div className="bg-linear-to-r from-white to-gray-50 shadow-lg border-b border-gray-200 px-2 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
      <div className="relative w-full sm:flex-1 sm:max-w-md">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="relative w-full sm:w-auto">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
      </div>
      <button
        onClick={handleSearch}
        className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        Search
      </button>
    </div>
  );
};

export default Filter;
