import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { api } from "../utils/api";
import { RefreshCcw } from "lucide-react";

const PendingVendors = ({
  pendingVendors,
  loading,
  fetchPendingVendors,
  setSuccess,
  errorPending,
}) => {
  const [vendorSearch, setVendorSearch] = useState("");
  const [approvingVendorId, setApprovingVendorId] = useState(null);
  const [rejectingVendorId, setRejectingVendorId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(errorPending);
  }, [errorPending]);

  const handleApprove = async (vendorId) => {
    setApprovingVendorId(vendorId);
    try {
      await api.put(`/admin/vendors/${vendorId}/approve`);
      setSuccess("Vendor approved successfully.");
      fetchPendingVendors();
    } catch (error) {
      setError("Failed to approve vendor.");
    } finally {
      setApprovingVendorId(null);
    }
  };

  const handleReject = async (vendorId) => {
    setRejectingVendorId(vendorId);
    try {
      await api.put(`/admin/vendors/${vendorId}/reject`);
      setSuccess("Vendor rejected successfully.");
      fetchPendingVendors();
    } catch (error) {
      setError("Failed to reject vendor.");
    } finally {
      setRejectingVendorId(null);
    }
  };

  const filteredVendors = pendingVendors.filter(
    (vendor) =>
      vendor.business_name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      vendor.email.toLowerCase().includes(vendorSearch.toLowerCase()),
  );

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 my-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg md:text-3xl font-bold">Pending Vendors</h1>
          <button
            onClick={fetchPendingVendors}
            disabled={loading}
            className="px-2 py-1 md:px-4 md:py-2 bg-gray-400 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw
              className={`w-4 h-4 md:w-6 md:h-6 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr className="border-b">
                  <th
                    scope="col"
                    className="py-2 px-4 text-left text-sm font-medium"
                  >
                    User ID
                  </th>
                  <th
                    scope="col"
                    className="py-2 px-4 text-left text-sm font-medium"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="py-2 px-4 text-left text-sm font-medium"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell py-2 px-4 text-left text-sm font-medium"
                  >
                    Created Date
                  </th>
                  <th
                    scope="col"
                    className="py-2 px-4 text-left text-sm font-medium"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 border-b">
                    <td className="py-2 px-4 text-center text-sm">
                      {vendor.id}
                    </td>
                    <td className="py-2 px-4 text-sm">
                      {vendor.business_name}
                    </td>
                    <td className="py-2 px-4 text-sm truncate max-w-[150px]">
                      {vendor.email}
                    </td>
                    <td className="hidden sm:table-cell py-2 px-4 text-sm">
                      {new Date(vendor.created_at).toLocaleDateString()}
                    </td>
                    <td className="flex gap-1 items-center py-2 px-4 ">
                      <button
                        onClick={() => handleApprove(vendor.id)}
                        disabled={approvingVendorId === vendor.id}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 disabled:opacity-50 text-sm"
                      >
                        {approvingVendorId === vendor.id
                          ? "Approving..."
                          : "Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(vendor.id)}
                        disabled={rejectingVendorId === vendor.id}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 text-sm"
                      >
                        {rejectingVendorId === vendor.id
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingVendors;
