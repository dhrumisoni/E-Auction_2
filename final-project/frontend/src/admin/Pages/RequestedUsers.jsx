import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";

const RequestedUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch requested users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/requested-users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching requested users:", err);
        setError("Failed to fetch requested users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const requestedUsers = users.filter(
    (u) =>
      u.status?.toLowerCase() === "requested" &&
      (u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading requested users...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        ❌ {error}
      </p>
    );

  return (
    <motion.div
      className="px-0 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-extrabold mb-6 text-purple-800 flex items-center gap-2">
        🕒 Requested Users
        <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
          {requestedUsers.length}
        </span>
      </h1>

      {/* 🔍 Search */}
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="🔍 Search requested users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-gray-700 shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* 🧍 Requested User Cards */}
      {requestedUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestedUsers.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.05 }}
              className="p-5 bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 cursor-pointer"
              onClick={() => navigate(`/admin/requested-users/${user.id}`)}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-purple-600 font-bold text-lg border-2 border-purple-400 shadow-md">
                {user.name?.charAt(0) || "?"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {user.name} {user.surname}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm mt-1">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                    {user.status}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          😕 No requested users found
        </p>
      )}
    </motion.div>
  );
};

export default RequestedUsers;
