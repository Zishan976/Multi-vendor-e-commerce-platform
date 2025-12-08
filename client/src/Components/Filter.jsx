import React, { useState, useEffect } from "react";
import { api } from "../utils/api";

const Filter = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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
    <div className="lg:hidden bg-white shadow-md text-[#4c4b6f] px-4 py-3 flex  items-center justify-center gap-1.5">
      <input
        type="text"
        placeholder="Search products"
        className=" md:px-4 md:py-2 px-2 py-1 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-w-16"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="md:px-4 md:py-2 px-2 py-1 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
