import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import Loading from "./Loading";

const ProfileSection = ({
  profile,
  formData,
  setFormData,
  loadingProfile,
  fetchProfile,
  setSuccess,
  errorProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setError(errorProfile);
  }, [errorProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError(null);
      await api.put("/vendor/profile", formData);
      setSuccess("Profile updated successfully.");
      setIsEditing(false);
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loadingProfile) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-lg">
      <h2 className="text:lg md:text-2xl font-bold text-gray-800 mb-5 border-b-2 border-green-600 pb-2">
        Vendor Profile
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {error}
        </div>
      )}
      {isEditing ? (
        <div className="flex justify-center">
          <form
            onSubmit={handleUpdate}
            className="flex flex-col gap-4 max-w-md w-full bg-white p-6 rounded shadow-md"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) =>
                  setFormData({ ...formData, business_name: e.target.value })
                }
                placeholder="Business Name"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description
              </label>
              <textarea
                value={formData.business_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business_description: e.target.value,
                  })
                }
                placeholder="Business Description"
                required
                className="w-full p-3 border border-gray-300 rounded resize-none min-h-32 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <p className="mb-3">
            <strong className="text-gray-700 text-sm">Business Name:</strong>{" "}
            {profile.business_name}
          </p>
          <p className="mb-4">
            <strong className="text-gray-700 text-sm">Description:</strong>{" "}
            {profile.business_description}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="md:px-4 md:py-2 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
