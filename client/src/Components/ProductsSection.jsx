import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import Loading from "./Loading";
import { RefreshCcw } from "lucide-react";

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
        <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b-2 border-blue-600 pb-2">
          My Products
        </h2>
        <button
          onClick={fetchProducts}
          disabled={loadingProducts}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw className={loadingProducts ? "animate-spin" : ""} />
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-5 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <AddProductForm
          editingProduct={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSuccess={fetchProducts}
        />
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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-5"
    >
      <h3 className="text-lg font-semibold mb-4">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h3>
      {submitError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {submitError}
        </div>
      )}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          required
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded resize-vertical min-h-24 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          step="0.01"
          required
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={formData.stock_quantity}
          required
          onChange={(e) =>
            setFormData({ ...formData, stock_quantity: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <select
          value={formData.category_id}
          required
          onChange={(e) =>
            setFormData({ ...formData, category_id: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          disabled={loadingCategories}
        >
          <option value="">
            {loadingCategories ? "Loading categories..." : "Select Category"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <input
          type="file"
          accept="image/*"
          required={!editingProduct}
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : editingProduct
                ? "Update Product"
                : "Add Product"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
