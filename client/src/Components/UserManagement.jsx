import React, { useState } from "react";
import Loading from "./Loading";
import { api } from "../utils/api";

const UserManagement = ({
  users,
  loading,
  fetchUsers,
  setSuccess,
  setError,
}) => {
  const [userSearch, setUserSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const handleRoleChange = (userId, newRole) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleUpdateRole = async (userId) => {
    setActionLoading(userId);
    const user = users.find((u) => u.id === userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: user.role });
      setSuccess("User role updated successfully.");
      fetchUsers();
    } catch (error) {
      setError("Failed to update user role.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 my-10">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <input
          type="text"
          placeholder="Search users by username or email..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
      </div>
      <div className="max-w-6xl mx-auto px-6 mb-20">
        {loading ? (
          <Loading />
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-gray-600">No users found.</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">User ID</th>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border border-gray-300 px-2 py-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleUpdateRole(user.id)}
                      disabled={actionLoading === user.id}
                      className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600 disabled:opacity-50"
                    >
                      {actionLoading === user.id ? "Updating..." : "Update"}
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

export default UserManagement;
