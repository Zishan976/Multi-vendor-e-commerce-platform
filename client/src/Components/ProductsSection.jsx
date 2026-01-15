import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import Loading from "./Loading";
import { RefreshCcw } from "lucide-react";

const ProductsSection = ({
  products,
  loadingProducts,
  fetchProducts,
  errorProducts,
  setSuccess,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
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
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold text-green-600 mb-3">
                Price: ${product.price}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    /* Implement edit */
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

const AddProductForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      await api.post("/products/vendor", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-5"
    >
      <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <textarea
          placeholder="Description"
          required
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded resize-vertical min-h-24 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder="Price"
          step="0.01"
          required
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Product
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
