import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import api from "../../../api";

export default function RequestedUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/user/${id}");
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleAction = async (status) => {
    try {
      const res = await api.put("/admin/user/status/${id}",
        { status }
      );
      setMessage(res.data.message);
      setMsgType(status === "Approved" ? "success" : "error");

      setTimeout(() => navigate("/admin/requested-users"), 2000);
    } catch (err) {
      console.error("❌ Error updating status:", err);
      setMsgType("error");
      setMessage("Failed to update user status.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user)
    return <p className="text-center mt-10 text-gray-500">User not found</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-8"
    >
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md transition"
      >
        ⬅️ Back to Requested Users
      </button>

      {/* 🧾 User Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 flex flex-col items-center">
        {user.document_type ? (
          <img
            src={user.document_type}
            alt="User Document"
            className="w-40 h-40 object-cover rounded-full border-4 border-purple-500 shadow-md"
          />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
            No Document Uploaded
          </div>
        )}

        <h1 className="mt-4 text-3xl font-extrabold text-gray-800">
          {user.name} {user.surname}
        </h1>
        <p className="text-gray-500">{user.email}</p>
        <span className="mt-2 px-4 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
          {user.status}
        </span>
      </div>

      {/* 🧩 Info + Buttons */}
      <div className="mt-10 bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-purple-700">
          📋 User Request Info
        </h2>

        <div className="space-y-3 text-gray-700">
          <p><b>📞 Phone:</b> {user.number}</p>
          <p><b>📧 Email:</b> {user.email}</p>
          <p><b>🏙️ City:</b> {user.city?.name || "N/A"}</p>
          <p><b>🗺️ State:</b> {user.city?.state?.name || "N/A"}</p>
          <p><b>🌍 Country:</b> {user.city?.state?.country?.name || "N/A"}</p>
          <p><b>📮 Address:</b> {user.address || "N/A"}</p>
          <p><b>🆔 User ID:</b> {user.id}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleAction("Approved")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
          >
            ✅ Approve
          </button>
          <button
            onClick={() => handleAction("Rejected")}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
          >
            ❌ Reject
          </button>
        </div>

        {/* 💬 Animated Message Box */}
        <AnimatePresence>
          {message && (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-6 text-center p-4 rounded-lg font-semibold shadow-md ${
                msgType === "success"
                  ? "bg-green-100 text-green-700 border border-green-400"
                  : "bg-red-100 text-red-700 border border-red-400"
              }`}
            >
              {msgType === "success" ? "✅ " : "❌ "}
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
