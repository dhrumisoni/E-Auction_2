// src/admin/Components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCircle,
  Gavel,
  Shield,
  Inbox,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const loc = useLocation().pathname;
  const navigate = useNavigate();

  // ✅ get role from localStorage
  const role = localStorage.getItem("adminRole"); // "admin" | "manager" | "staff"

  const active = (path) =>
    loc === path
      ? "bg-gradient-to-r from-white to-white/90 text-[#0b3d91] font-semibold shadow-lg"
      : "text-white/80 hover:bg-white/10 hover:text-white transition";

  const [openUsers, setOpenUsers] = useState(true);
  const [openBids, setOpenBids] = useState(true);
  const [openPayments, setOpenPayments] = useState(true);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("adminRole");
    navigate("/admin/login");
  };

  // 🚫 Staff restriction alert
  const handleRestrictedClick = (e) => {
    e.preventDefault();
    alert("🚫 Access denied: You do not have permission to open this section.");
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-[#0b3d91] via-[#0a2e70] to-[#081d49] text-white min-h-screen rounded-r-3xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
          ⚡ <span className="bg-white/20 px-2 py-1 rounded-lg">E-Auction</span>
        </div>
        <div className="text-sm mt-1 text-white/70">Admin Dashboard</div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 flex-1 space-y-3 overflow-y-auto">
        {/* Dashboard */}
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl ${active("/admin/dashboard")}`}
        >
          <LayoutDashboard size={18} /> <span>Dashboard</span>
        </Link>

        {/* Profile */}
        <Link
          to="/admin/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl ${active("/admin/profile")}`}
        >
          <UserCircle size={18} /> <span>Profile</span>
        </Link>

        {/* Inbox */}
        <Link
          to="/admin/inbox"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl ${active("/admin/inbox")}`}
        >
          <Inbox size={18} /> <span>Inbox</span>
        </Link>

        {/* Users */}
        <div>
          <button
            onClick={() => setOpenUsers(!openUsers)}
            className="flex items-center justify-between w-full px-4 py-3 text-white/90 hover:bg-white/10 rounded-xl"
          >
            <span className="flex items-center gap-3">
              <Users size={18} /> Users
            </span>
            {openUsers ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {openUsers && (
            <div className="ml-6 mt-1 space-y-1">
              <Link
                to="/admin/activeusers"
                className={`block px-4 py-2 rounded-lg ${active("/admin/activeusers")}`}
              >
                Active Users
              </Link>
              <Link
                to="/admin/requested-users"
                className={`block px-4 py-2 rounded-lg ${active("/admin/requested-users")}`}
              >
                Requested Users
              </Link>
            </div>
          )}
        </div>

        {/* Payments */}
        <div>
          <button
            onClick={() => setOpenPayments(!openPayments)}
            className="flex items-center justify-between w-full px-4 py-3 text-white/90 hover:bg-white/10 rounded-xl"
          >
            <span className="flex items-center gap-3">
              <CreditCard size={18} /> Payments
            </span>
            {openPayments ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {openPayments && (
            <div className="ml-6 mt-1 space-y-1">
              {/* User Payments - accessible for all */}
              <Link
                to="/admin/payments"
                className={`block px-4 py-2 rounded-lg ${active("/admin/payments")}`}
              >
                User Payments
              </Link>

              {/* Broker Payments - restricted for staff */}
              {role === "Employee" ? (
                <button
                  onClick={handleRestrictedClick}
                  className="block w-full text-left px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                >
                  Broker Payments 🚫
                </button>
              ) : (
                <Link
                  to="/admin/broker-payments"
                  className={`block px-4 py-2 rounded-lg ${active("/admin/broker-payments")}`}
                >
                  Broker Payments
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Bids */}
        <div>
          <button
            onClick={() => setOpenBids(!openBids)}
            className="flex items-center justify-between w-full px-4 py-3 text-white/90 hover:bg-white/10 rounded-xl"
          >
            <span className="flex items-center gap-3">
              <Gavel size={18} /> Bids
            </span>
            {openBids ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {openBids && (
            <div className="ml-6 mt-1 space-y-1">
              <Link
                to="/admin/active-bids"
                className={`block px-4 py-2 rounded-lg ${active("/admin/active-bids")}`}
              >
                Active Bids
              </Link>
              <Link
                to="/admin/requested-bids"
                className={`block px-4 py-2 rounded-lg ${active("/admin/requested-bids")}`}
              >
                Requested Bids
              </Link>
              <Link
                to="/admin/winner-bids"
                className={`block px-4 py-2 rounded-lg ${active("/admin/winner-bids")}`}
              >
                Winner Bids
              </Link>
              
              <Link
                to="/admin/bids-history"
                className={`block px-4 py-2 rounded-lg ${active("/admin/bids-history")}`}
              >
                Bids History
              </Link>

              {/* Auction Settings - restricted for staff */}
              {role === "Employee" ? (
                <button
                  onClick={handleRestrictedClick}
                  className="block w-full text-left px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                >
                  Auction Settings 🚫
                </button>
              ) : (
                <Link
                  to="/admin/auction-settings"
                  className={`block px-4 py-2 rounded-lg ${active("/admin/auction-settings")}`}
                >
                  Auction Settings
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Admin Management - restricted for staff */}
        {role === "Employee" ? (
          <button
            onClick={handleRestrictedClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed w-full text-left"
          >
            <Shield size={18} /> <span>Admin Management 🚫</span>
          </button>
        ) : (
          <Link
            to="/admin/admin-management"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${active("/admin/admin-management")}`}
          >
            <Shield size={18} /> <span>Admin Management</span>
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-sm flex items-center justify-center gap-2 transition-all duration-300"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
