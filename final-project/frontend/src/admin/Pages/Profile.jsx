import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../api";
import { motion } from "framer-motion";

const Profile = () => {
  const [admin, setAdmin] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/admin`;
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile/${adminId}`);
        setAdmin({
          name: res.data.name,
          surname: res.data.surname,
          email: res.data.email,
          role: res.data.role,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setMessage("⚠️ Error loading profile. Please re-login.");
      } finally {
        setLoading(false);
      }
    };

    if (adminId) fetchProfile();
    else {
      setMessage("Please login first.");
      setLoading(false);
    }
  }, [adminId]);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.put(`${API_URL}/update-admin/${adminId}`, {
        email: admin.email,
        password: admin.password,
      });

      setMessage("✅ Profile updated successfully!");
      setAdmin({ ...admin, password: "" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Error updating profile. Try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-2xl shadow-md"
        >
          ⏳ Loading profile...
        </motion.div>
      </div>
    );

  return (
    <motion.div
      className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-100 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-purple-300">
            {admin.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-semibold">
            {admin.name} {admin.surname}
          </h2>
          <p className="text-sm opacity-80">{admin.role}</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center mb-4 font-semibold ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </motion.p>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={admin.name}
                disabled
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Surname
              </label>
              <input
                type="text"
                name="surname"
                value={admin.surname}
                disabled
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={admin.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={admin.role}
                disabled
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
            >
              💾 Save Changes
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
