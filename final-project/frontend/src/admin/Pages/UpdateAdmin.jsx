// src/admin/Pages/UpdateAdmin.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../api";

export default function UpdateAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    role: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch admin details by ID
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get("/admin/admin/${id}");
        setFormData({
          name: res.data.name || "",
          surname: res.data.surname || "",
          role: res.data.role || "",
          email: res.data.email || "",
        });
      } catch (err) {
        console.error("❌ Error fetching admin:", err);
        alert("Failed to load admin details!");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/admin/admin/update/${id}", formData);
      alert("✅ Admin updated successfully!");
      navigate("/admin/admin-management");
    } catch (err) {
      console.error("❌ Error updating admin:", err);
      alert("Failed to update admin!");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 py-6">Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Surname:</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Admin
        </button>
      </form>
    </div>
  );
}
