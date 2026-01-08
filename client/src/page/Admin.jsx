import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import PendingVendors from "../Components/PendingVendors";
import UserManagement from "../Components/UserManagement";
import AdminDashboard from "../Components/AdminDashboard";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import { TriangleAlert } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [pendingVendors, setPendingVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      return; // Don't fetch data if not admin
    }

    fetchPendingVendors();
    fetchUsers();
  }, [navigate]);

  const fetchPendingVendors = async () => {
    setLoadingVendors(true);
    try {
      const response = await api.get("/admin/vendors/pending");
      setPendingVendors(response.data);
    } catch (error) {
      setError("Failed to fetch pending vendors.");
    } finally {
      setLoadingVendors(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const totalUsers = users.length;
  const pendingVendorsCount = pendingVendors.length;
  const approvedVendorsCount = users.filter(
    (user) => user.role === "vendor"
  ).length;

  // If not admin, show access denied message
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <TriangleAlert className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-gray-600">
              You are not an admin. You don't have permission to access this
              page.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDashboard
        totalUsers={totalUsers}
        pendingVendorsCount={pendingVendorsCount}
        approvedVendorsCount={approvedVendorsCount}
        success={success}
        error={error}
      />
      <PendingVendors
        pendingVendors={pendingVendors}
        loading={loadingVendors}
        fetchPendingVendors={fetchPendingVendors}
        setSuccess={setSuccess}
        setError={setError}
      />
      <UserManagement
        users={users}
        loading={loadingUsers}
        setUsers={setUsers}
        fetchUsers={fetchUsers}
        setSuccess={setSuccess}
        setError={setError}
      />
    </>
  );
};

export default Admin;
