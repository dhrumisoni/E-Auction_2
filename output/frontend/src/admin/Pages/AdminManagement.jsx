import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../../../api";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Admins
  const fetchAdmins = async () => {
    try {
      const response = await api.get("/admin/get-all-admins");
      setAdmins(response.data);
    } catch (error) {
      console.error("❌ Error fetching admin data:", error);
      alert("Failed to load admin data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 🔥 Delete Admin
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;

    try {
      await api.delete("/admin/delete-admin/${id}");

      alert("Admin deleted successfully!");
      fetchAdmins(); // Refresh list
    } catch (error) {
      console.error("❌ Error deleting admin:", error);
      alert("Failed to delete admin!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Management</h2>

      {loading ? (
        <p className="text-gray-500 text-center py-6">Loading admin data...</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No admins found.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Surname</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50 border-b">
                <td className="p-3">{admin.name}</td>
                <td className="p-3">{admin.surname}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-600">
                    {admin.role}
                  </span>
                </td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3 text-center space-x-2">
                  {/* Edit Button */}
                  <Link
                    to={`edit/${admin.id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link
        to="../add-admin"
        className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        + Add New
      </Link>
    </div>
  );
}
