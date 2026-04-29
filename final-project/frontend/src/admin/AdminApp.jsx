// src/admin/AdminApp.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Profile from "./Pages/Profile";
import Active from "./Pages/ActiveUsers";
import UserDetails from "./Pages/UserDetails";
import RequestedUsers from "./Pages/RequestedUsers";
import RequestedUserDetails from "./Pages/RequestedUserDetails";
import Payments from "./Pages/Payments";
import PaymentDetails from "./Pages/PaymentDetails";
import BrokerPayments from "./Pages/BrokerPayments";
import BrokerPaymentDetails from "./Pages/BrokerPaymentDetails";
import ActiveBids from "./Pages/ActiveBids";
import ActiveBidDetails from "./Pages/ActiveBidDetails";
import RequestedBids from "./Pages/RequestedBids";
import RequestedBidDetails from "./Pages/RequestedBidDetails";
import AdminManagement from "./Pages/AdminManagement";
import AddAdmin from "./Pages/AddAdmin";
import AdminDetails from "./Pages/AdminDetails";
import WinnerBids from "./Pages/WinnerBids";
import WinnerBidDetails from "./Pages/WinnerBidDetails";
import BidLogs from "./Pages/BidLogs";
import BidLogDetails from "./Pages/BidLogDetails";
import AuctionSettings from "./Pages/AuctionSettings";
import BidsHistory from "./Pages/BidsHistory";
import BidsHistoryDetails from "./Pages/BidsHistoryDetails";
import Inbox from "./Pages/Inbox";
import AdminLoginPage from "./Pages/AdminLoginPage";
import UpdateAdmin from "./Pages/UpdateAdmin";

// ✅ Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

// ✅ Dashboard Layout
function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#eaf2ff]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <Topbar />
        </div>
        <main className="flex-1 p-6">
          <div className="max-w-full mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="activeusers" element={<Active />} />
              <Route path="requested-users" element={<RequestedUsers />} />
              <Route path="requested-users/:id" element={<RequestedUserDetails />} />
              <Route path="payments" element={<Payments />} />
              <Route path="payments/:id" element={<PaymentDetails />} />
              <Route path="broker-payments" element={<BrokerPayments />} />
              <Route path="broker-payments/:id" element={<BrokerPaymentDetails />} />
              <Route path="active-bids" element={<ActiveBids />} />
              <Route path="active-bids/:id" element={<ActiveBidDetails />} />
              <Route path="requested-bids" element={<RequestedBids />} />
              <Route path="requested-bids/:id" element={<RequestedBidDetails />} />
              <Route path="admin-management" element={<AdminManagement />} />
              <Route path="admin-management/:id" element={<AdminDetails />} />
              <Route path="add-admin" element={<AddAdmin />} />
              <Route path="winner-bids" element={<WinnerBids />} />
              <Route path="winner-bids/:id" element={<WinnerBidDetails />} />
              <Route path="bid-logs" element={<BidLogs />} />
              <Route path="bid-logs/:itemId" element={<BidLogDetails />} />
              <Route path="auction-settings" element={<AuctionSettings />} />
              <Route path="bids-history" element={<BidsHistory />} />
              <Route path="bids-history/:itemId" element={<BidsHistoryDetails />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="admin-management/edit/:id" element={<UpdateAdmin />} />


            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ Main AdminApp
export default function AdminApp() {
  return (
    <Routes>
      {/* 🔹 If not logged in, show Login */}
      <Route path="login" element={<AdminLoginPage />} />

      {/* 🔹 Protected Dashboard */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* 🔹 Redirect /admin to /admin/login */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
