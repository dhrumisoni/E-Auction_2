import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/entry-payments`);
        const data = await res.json();

        if (data.success) {
          const selected = data.data.find((b) => b.bidId === parseInt(id));
          if (selected) {
            setItem(selected);
            setFilteredUsers(selected.users);
          }
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // 🔍 Filter users inside the selected bid
  useEffect(() => {
    if (item) {
      if (search.trim() === "") {
        setFilteredUsers(item.users);
      } else {
        const filtered = item.users.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    }
  }, [search, item]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!item)
    return <p className="text-center mt-10 text-gray-500">No payment data found</p>;

  return (
    <motion.div
      className="max-w-3xl mx-auto p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        ⬅️ Back to Items
      </button>

      {/* Header */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">{item.bidName}</h1>
            <p className="text-gray-600">
              Total Users Paid: <b>{item.users.length}</b>
            </p>
          </div>

          {/* 🔍 Search User */}
          <input
            type="text"
            placeholder="Search user by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* User list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <motion.div
              key={u.id}
              whileHover={{ scale: 1.03 }}
              className="p-5 bg-white rounded-xl shadow-md border"
            >
              <h2 className="font-bold text-gray-800">{u.name}</h2>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-sm mt-2">
                Amount: <b>₹{u.amount}</b>
              </p>
              <p className="mt-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 w-fit">
                Paid
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 col-span-2 text-center">
            No users found
          </p>
        )}
      </div>
    </motion.div>
  );
}
