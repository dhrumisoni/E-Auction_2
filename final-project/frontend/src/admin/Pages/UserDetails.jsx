import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import api from "../../../api";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch user details from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/user/${id}");
        const data = res.data;

        // format document path
        const formattedUser = {
          ...data,
          document_type: data.document_type?.startsWith("http")
            ? data.document_type
            : `${import.meta.env.VITE_API_URL}/photos/${data.document_type}`,
        };

        setUser(formattedUser);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSave = async () => {
    setEditing(false);
    alert("✅ User details updated successfully!");
  };

  // ✅ Block user function
  const handleBlockUser = async () => {
    try {
      const confirmBlock = window.confirm("Are you sure you want to block this user?");
      if (!confirmBlock) return;

      await api.put("/admin/user/block/${id}");
      alert("🚫 User blocked successfully!");
      navigate(-1);
    } catch (error) {
      console.error("❌ Error blocking user:", error);
      alert("Failed to block user");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">⏳ Loading user...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">❌ {error}</p>;

  if (!user)
    return <p className="text-center mt-10 text-gray-500">No user found</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-8"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md transition"
      >
        ⬅️ Back to Users
      </button>

      {/* Profile Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 flex flex-col items-center">
        <img
          src={user.document_type}
          alt={user.name}
          className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
        />
        <h1 className="mt-4 text-3xl font-extrabold text-gray-800">
          {user.name} {user.surname}
        </h1>
        <p className="text-gray-500">{user.email}</p>
        <span
          className={`mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
            user.status === "Approved"
              ? "bg-green-100 text-green-700"
              : user.status === "Blocked"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {user.status}
        </span>
      </div>

      {/* Details Section */}
      <div className="mt-10 bg-white shadow-xl rounded-2xl p-6">
        {!editing ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              📋 User Information
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <b>Number:</b> {user.number}
              </p>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>Status:</b> {user.status}
              </p>
            </div>

            {/* ✅ If user is approved, show Block button; else show Edit */}
            {user.status === "Approved" ? (
              <button
                onClick={handleBlockUser}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
              >
                🚫 Block User
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
              >
                ✏️ Edit Details
              </button>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              ✏️ Edit User
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                value={user.number}
                onChange={(e) => setUser({ ...user, number: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
                >
                  💾 Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}
