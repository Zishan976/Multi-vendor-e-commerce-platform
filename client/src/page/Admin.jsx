import { useEffect, useState } from "react";
import PendingVendors from "../Components/PendingVendors";
import UserManagement from "../Components/UserManagement";
import AdminDashboard from "../Components/AdminDashboard";
import CategoryManagement from "../Components/CategoryManagement";
import CouponManagement from "../Components/CouponManagement";
import { api } from "../utils/api";
// import { useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import toast from "react-hot-toast";

const Admin = () => {
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingVendors, setPendingVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorDashboard, setErrorDashboard] = useState("");
  const [errorPending, setErrorPending] = useState("");
  const [errorUsers, setErrorUsers] = useState("");
  const [errorCategories, setErrorCategories] = useState("");
  const [errorCoupons, setErrorCoupons] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVendorsCount: 0,
    approvedVendorsCount: 0,
  });

  useEffect(() => {
    if (success) {
      toast.success(success);
      setSuccess("");
    }
  }, [success]);

  useEffect(() => {
    if (!isAdmin()) return;

    fetchStats();
    if (activeTab === "pending" && pendingVendors.length === 0) {
      fetchPendingVendors();
    } else if (activeTab === "users" && users.length === 0) {
      fetchUsers();
    } else if (activeTab === "categories" && categories.length === 0) {
      fetchCategories();
    } else if (activeTab === "coupons" && coupons.length === 0) {
      fetchCoupons();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    setErrorCategories("");
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      setErrorCategories("Failed to fetch categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    setErrorCoupons("");
    try {
      const response = await api.get("/coupons");
      setCoupons(response.data);
    } catch (err) {
      setErrorCoupons("Failed to fetch coupons.");
    } finally {
      setLoadingCoupons(false);
    }
  };

  const fetchPendingVendors = async () => {
    setLoadingVendors(true);
    setErrorPending("");
    try {
      const response = await api.get("/admin/vendors/pending");
      setPendingVendors(response.data);
    } catch (error) {
      setErrorPending("Failed to fetch pending vendors.");
    } finally {
      setLoadingVendors(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers("");
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      setErrorUsers("Failed to fetch users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    setErrorDashboard("");
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
      console.log("Admin stats:", response.data);
    } catch (error) {
      setErrorDashboard("Failed to fetch admin stats.");
    } finally {
      setLoadingStats(false);
    }
  };

  const activatebuttons = [
    "dashboard",
    "pending",
    "users",
    "categories",
    "coupons",
  ];

  // If not admin, show access denied message
  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You are not admin. You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-5 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Admin Dashboard
      </h1>

      {/* Tab Navigation */}
      <div className="flex justify-start mb-8 border-b-2 border-gray-200 overflow-x-auto">
        {activatebuttons.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 text-lg font-medium border-b-2 transition-all duration-300 ${
              activeTab === tab
                ? "text-green-600 border-green-600"
                : "text-gray-600 border-transparent hover:text-green-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <AdminDashboard
          fetchStats={fetchStats}
          loadingStats={loadingStats}
          totalUsers={stats.totalUsers}
          pendingVendorsCount={stats.pendingVendorsCount}
          approvedVendorsCount={stats.approvedVendorsCount}
          errorDashboard={errorDashboard}
        />
      )}
      {activeTab === "pending" && (
        <PendingVendors
          pendingVendors={pendingVendors}
          loading={loadingVendors}
          fetchPendingVendors={fetchPendingVendors}
          setSuccess={setSuccess}
          errorPending={errorPending}
        />
      )}
      {activeTab === "users" && (
        <UserManagement
          users={users}
          setUsers={setUsers}
          loading={loadingUsers}
          fetchUsers={fetchUsers}
          setSuccess={setSuccess}
          errorUsers={errorUsers}
        />
      )}
      {activeTab === "categories" && (
        <CategoryManagement
          categories={categories}
          loadingCategories={loadingCategories}
          fetchCategories={fetchCategories}
          errorCategories={errorCategories}
          setSuccess={setSuccess}
        />
      )}
      {activeTab === "coupons" && (
        <CouponManagement
          coupons={coupons}
          loadingCoupons={loadingCoupons}
          fetchCoupons={fetchCoupons}
          errorCoupons={errorCoupons}
          setSuccess={setSuccess}
        />
      )}
    </div>
  );
};

export default Admin;
