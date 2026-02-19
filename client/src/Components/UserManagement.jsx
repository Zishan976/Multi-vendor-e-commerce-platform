import React, { useState } from "react";
import Loading from "./Loading";
import { api } from "../utils/api";
import { RefreshCcw } from "lucide-react";

const UserManagement = ({
  users,
  setUsers,
  loading,
  fetchUsers,
  setSuccess,
  errorUsers,
}) => {
  const [userSearch, setUserSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setError(errorUsers);
  }, [errorUsers]);

  const handleRoleChange = (userId, newRole) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user,
      ),
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
      user.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 my-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg md:text-3xl font-bold">User Management</h1>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-2 py-1 md:px-4 md:py-2 bg-gray-400 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw
              className={`w-4 h-4 md:w-6 md:h-6 ${loading ? "animate-spin-reverse" : ""}`}
            />
          </button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
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
                    Username
                  </th>
                  <th
                    scope="col"
                    className="py-2 px-4 text-left text-sm font-medium"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="py-2 px-4 text-left text-sm font-medium"
                  >
                    Role
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50  border-b">
                    <td className="py-2 px-4 text-center text-sm">{user.id}</td>
                    <td className="py-2 px-4 text-sm">{user.username}</td>
                    <td className="py-2 px-4 text-sm truncate max-w-[180px]">
                      {user.email}
                    </td>
                    <td className="py-2 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium
                ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-600"
                    : user.role === "vendor"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="flex gap-1 items-center py-2 px-4 ">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="border border-gray-300 px-2 py-1 rounded text-sm"
                      >
                        <option value="user">User</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleUpdateRole(user.id)}
                        disabled={actionLoading === user.id}
                        className="bg-green-500 text-white px-3 py-1 rounded ml-2 hover:bg-green-600 disabled:opacity-50 text-sm"
                      >
                        {actionLoading === user.id ? "Updating..." : "Update"}
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

export default UserManagement;
