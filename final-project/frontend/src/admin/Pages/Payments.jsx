import React, { useState, useEffect } from "react";
import api from "../../../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Payments() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/entry-payments`);
        const data = await res.json();
        if (data.success) {
          setItems(data.data);
          setFiltered(data.data);
        } else {
          setError("No payments found");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // 🔍 Filter bids based on search input
  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(items);
    } else {
      const filteredItems = items.filter((item) =>
        item.bidName.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredItems);
    }
  }, [search, items]);

  if (loading) return <div className="p-6">Loading payments...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">💰 Entry Payments by Item</h1>

        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="Search by Bid Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <motion.div
              key={item.bidId}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/admin/payments/${item.bidId}`)}
              className="p-6 bg-white rounded-2xl shadow-lg border cursor-pointer"
            >
              <h2 className="font-bold text-gray-800">{item.bidName}</h2>
              <p className="text-sm mt-2">
                Users Paid:{" "}
                <b className="text-blue-700">{item.users.length}</b>
              </p>
              <p className="mt-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 w-fit">
                ₹500 each
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-10">No items found</p>
      )}
    </motion.div>
  );
}
