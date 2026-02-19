import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import Loading from "./Loading";
import {
  RefreshCcw,
  X,
  Package,
  FileText,
  DollarSign,
  Hash,
  Tag,
  Image,
  CheckCircle,
} from "lucide-react";

// Utility function for robust text truncation
const truncateText = (text, maxWords = 23) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

const ProductsSection = ({
  products,
  loadingProducts,
  fetchProducts,
  errorProducts,
  setSuccess,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setError(errorProducts);
  }, [errorProducts]);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setDeleting(productId);
        setError(null);
        await api.delete(`/products/vendor/${productId}`);
        setSuccess("Product deleted successfully.");
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800 border-b-2 border-green-600 pb-2">
          My Products
        </h2>
        <button
          onClick={fetchProducts}
          disabled={loadingProducts}
          className="md:px-4 md:py-2 px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw
            className={`w-4 h-4 md:w-6 md:h-6 ${loadingProducts ? "animate-spin-reverse" : ""}`}
          />
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-5 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
        />
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out"
          onClick={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        >
          <div
            className="bg-white rounded-lg p-10 shadow-xl md:w-[80%] w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <AddProductForm
              editingProduct={editingProduct}
              onClose={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              onSuccess={fetchProducts}
            />
          </div>
        </div>
      )}

      {loadingProducts ? (
        <Loading />
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center text-gray-500 ${product.image_url ? "hidden" : "flex"}`}
                >
                  <span className="text-sm">No Image</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-2">
                {truncateText(product.description, 23)}
              </p>
              <p className="text-lg font-bold text-green-600 mb-3">
                Price: ${product.price}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingProduct(product);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting === product.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsSection;

const AddProductForm = ({ editingProduct, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    image: null,
    status: "",
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price || "",
        stock_quantity: editingProduct.stock_quantity || "",
        category_id: editingProduct.category_id || "",
        image: null, // Don't prefill image
        status: editingProduct.status || "active",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category_id: "",
        image: null,
        status: "active",
      });
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      // Only include image if it's actually selected (not null)
      if (key === "image" && !formData[key]) return;
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      if (editingProduct) {
        await api.put(`/products/vendor/${editingProduct.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products/vendor", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      setSubmitError(
        error.response?.data?.error ||
          "Failed to save product. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 bg-linear-to-r from-green-50 to-blue-50 -m-10 px-10 pt-6 pb-4 rounded-t-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-sm text-gray-600">
              {editingProduct
                ? "Update product information"
                : "Create a new product listing"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-gray-200 hover:bg-red-100 hover:text-red-600 rounded-full flex items-center justify-center transition-all duration-200"
        >
          <X size={18} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
            {submitError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4 mr-2 text-green-600" />
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2 text-green-600" />
              Description
            </label>
            <textarea
              placeholder="Enter detailed product description"
              value={formData.description}
              required
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-xl resize-vertical min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
              Price
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.price}
              step="0.01"
              required
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Hash className="w-4 h-4 mr-2 text-green-600" />
              Stock Quantity
            </label>
            <input
              type="number"
              placeholder="0"
              value={formData.stock_quantity}
              required
              onChange={(e) =>
                setFormData({ ...formData, stock_quantity: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Tag className="w-4 h-4 mr-2 text-green-600" />
              Category
            </label>
            <select
              value={formData.category_id}
              required
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select Category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Image className="w-4 h-4 mr-2 text-green-600" />
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editingProduct}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 file:cursor-pointer"
            />
          </div>
          <div className="flex-col md:flex-row flex gap-4 pt-6 border-t border-gray-200 mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-8 py-4 bg-linear-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-102 hover:shadow-lg flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {editingProduct ? "Update Product" : "Add Product"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-linear-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl font-semibold hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
