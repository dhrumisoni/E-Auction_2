// frontend/src/pages/admin/BrokerPayments.jsx
import { useState, useEffect } from "react";
import api from "../../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function BrokerPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/broker-payments`);
      const json = await res.json();

      if (json.success) setPayments(json.data || []);
      else setPayments([]);
    } catch (err) {
      console.error("Error fetching broker payments:", err);
      setPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  if (!payments.length)
    return (
      <p className="text-center mt-8 text-gray-500">
        No broker payments yet.
      </p>
    );

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-800">💰 Broker Payments</h1>

      <div className="grid gap-4">
        {payments.map((p) => (
          <div
            key={p.bidId}
            className="flex items-center justify-between bg-white p-5 rounded-xl shadow-md border hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/admin/broker-payments/${p.bidId}`)}
          >
            <div>
              <h2 className="font-semibold text-gray-800">
                {p.winner?.name || "Unknown"}
              </h2>
              <p className="text-sm text-gray-500">Product: {p.bidTitle}</p>
              <p className="text-sm text-gray-500">
                Final Price: ₹{Number(p.finalPrice).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Commission: ₹{Number(p.commissionAmount).toLocaleString()}
              </p>
            </div>

            <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
              Winner
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
