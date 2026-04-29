// src/admin/Pages/ActiveBidDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ActiveBidDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/bids/${id}`);
        const data = await res.json();
        if (data.success) {
          setBid(data.bid);
          setBidders(data.bidders);
        }
      } catch (err) {
        console.error("Error fetching bid details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetails();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Loading bid details...
      </p>
    );

  if (!bid)
    return (
      <p className="text-center mt-10 text-gray-500">
        Bid not found or inactive
      </p>
    );

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        ⬅️ Back to Active Bids
      </button>

      {/* 🏷️ Bid Info Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border">
        <h1 className="text-2xl font-bold mb-2 text-blue-700">{bid.title}</h1>
        <p className="text-gray-600 mb-1">
          <b>Seller:</b> {bid.user?.name || "Unknown"}
        </p>
        <p className="text-gray-600 mb-1">
          <b>Category:</b> {bid.category?.name || "Uncategorized"}
        </p>
        <p className="text-gray-600 mb-1">
          <b>Ends at:</b>{" "}
          {new Date(bid.end_date).toLocaleDateString("en-GB")}
        </p>
        <p className="text-lg font-semibold text-green-700">
          Base Price: ₹{bid.price.toLocaleString()}
        </p>
      </div>

      {/* 👥 Active Bidders */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          🧑‍💼 Active Bidders ({bidders.length})
        </h2>

        {bidders.length > 0 ? (
          <div className="grid gap-4">
            {bidders.map((b, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-50 rounded-xl shadow-sm border"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">
                    {b.user?.name || "Unknown"}
                  </h2>
                  <p className="text-green-700 font-semibold">
                    ₹{b.price.toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Email: {b.user?.email || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {b.user?.number || "N/A"}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No users have bid yet for this auction.
          </p>
        )}
      </div>
    </motion.div>
  );
}
