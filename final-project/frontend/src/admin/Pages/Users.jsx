import React, { useState } from "react";
import { motion } from "framer-motion";

const Users = () => {
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      email: "amit@example.com",
      role: "User",
      status: "Active",
      avatar: "https://i.pravatar.cc/100?img=11",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@example.com",
      role: "Manager",
      status: "Blocked",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: 3,
      name: "Rahul Mehta",
      email: "rahul@example.com",
      role: "Admin",
      status: "Active",
      avatar: "https://i.pravatar.cc/100?img=13",
    },
  ]);

  const handleBlockToggle = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Active" ? "Blocked" : "Active" }
          : user
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("❌ Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  return (
    <motion.div
      className="px-4 py-2 mt-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        👥 User Management
      </h1>

      {/* Search Bar */}
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* User Table */}
      <div className="shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700">
              <tr>
                <th className="p-4">Profile</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  (u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
                )
                .map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50`}
                  >
                    <td className="p-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border shadow-sm"
                      />
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      {user.name}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleBlockToggle(user.id)}
                        className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
                      >
                        {user.status === "Active" ? "Block" : "Unblock"}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Users;
