import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { storeTokens, getUserFromToken } from "../utils/auth";
import toast from "react-hot-toast";

const VendorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    business_description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.business_name.trim()) {
      setError("Business name is required");
      return;
    }
    if (!formData.business_description.trim()) {
      setError("Business description is required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/vendor/signup", formData);

      if (response.data.token) {
        storeTokens(response.data.token, null);
      }

      toast.success(
        response.data.message || "Vendor application submitted successfully!",
      );
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to submit vendor application";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Become a Vendor
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start selling your products on SwiftCart
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="business_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Business Name *
              </label>
              <input
                id="business_name"
                name="business_name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your business name"
                value={formData.business_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="business_description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Business Description *
              </label>
              <textarea
                id="business_description"
                name="business_description"
                rows={4}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Describe your business, products you sell, etc."
                value={formData.business_description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </form>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            What happens next?
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your application will be reviewed by our admin team</li>
            <li>
              • You'll receive an email once your vendor account is approved
            </li>
            <li>• After approval, you can access the Seller Dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;
