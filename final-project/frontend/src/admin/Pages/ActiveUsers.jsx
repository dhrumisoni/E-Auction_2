import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../api";

const ActiveUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch approved (active) users from backend
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/approved-users");

        // ✅ Ensure backend image URLs are correct
        const formatted = res.data.map((u) => ({
          ...u,
          document_type: u.document_type?.startsWith("http")
            ? u.document_type
            : `${import.meta.env.VITE_API_URL}/photos/${u.document_type}`,
        }));

        setUsers(formatted || []);
      } catch (err) {
        console.error("❌ Error fetching active users:", err);
        setError("Failed to load active users.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
  }, []);

  // ✅ Search filter for name or email
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <p className="text-center text-gray-500 mt-10">⏳ Loading active users...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">❌ {error}</p>;

  return (
    <motion.div
      className="px-0 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800 flex items-center gap-2">
        ✅ Active Users
        <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
          {filteredUsers.length}
        </span>
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="🔍 Search active users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-gray-700 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* User Cards */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.05 }}
              className="p-5 bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 cursor-pointer transition-all duration-200"
              onClick={() => navigate(`/admin/users/${user.id}`)} // ✅ navigate to user details
            >
              <img
                src={user.document_type}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-blue-400 shadow-md object-cover"
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {user.name} {user.surname}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm mt-1">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {user.status || "Approved"}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          😕 No active users found
        </p>
      )}
    </motion.div>
  );
};

export default ActiveUsers;
