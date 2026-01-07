import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import PendingVendors from "../Components/PendingVendors";
import UserManagement from "../Components/UserManagement";
import AdminDashboard from "../Components/AdminDashboard";
import { api } from "../utils/api";

const Admin = () => {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingVendors();
    fetchUsers();
  }, []);

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
