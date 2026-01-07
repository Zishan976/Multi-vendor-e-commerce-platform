import React, { useState } from "react";
import Loading from "./Loading";
import { api } from "../utils/api";

const PendingVendors = ({
  pendingVendors,
  loading,
  fetchPendingVendors,
  setSuccess,
  setError,
}) => {
  const [vendorSearch, setVendorSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const handleApprove = async (vendorId) => {
    setActionLoading(vendorId);
    try {
      await api.put(`/admin/vendors/${vendorId}/approve`);
      setSuccess("Vendor approved successfully.");
      fetchPendingVendors();
    } catch (error) {
      setError("Failed to approve vendor.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (vendorId) => {
    setActionLoading(vendorId);
    try {
      await api.put(`/admin/vendors/${vendorId}/reject`);
      setSuccess("Vendor rejected successfully.");
      fetchPendingVendors();
    } catch (error) {
      setError("Failed to reject vendor.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredVendors = pendingVendors.filter(
    (vendor) =>
      vendor.business_name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      vendor.email.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 my-10">
        <h2 className="text-2xl font-semibold mb-4">Pending Vendors</h2>
        <input
          type="text"
          placeholder="Search pending vendors by name or email..."
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
      </div>
      <div className="max-w-6xl mx-auto px-6 mb-20">
        {loading ? (
          <Loading />
        ) : filteredVendors.length === 0 ? (
          <div className="text-center text-gray-600">
            No pending vendors found.
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">User ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Created Date</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="py-2 px-4 border-b">{vendor.id}</td>
                  <td className="py-2 px-4 border-b">{vendor.business_name}</td>
                  <td className="py-2 px-4 border-b">{vendor.email}</td>
                  <td className="py-2 px-4 border-b">{vendor.created_at}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      disabled={actionLoading === vendor.id}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 disabled:opacity-50"
                    >
                      {actionLoading === vendor.id ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(vendor.id)}
                      disabled={actionLoading === vendor.id}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {actionLoading === vendor.id ? "Rejecting..." : "Reject"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default PendingVendors;
