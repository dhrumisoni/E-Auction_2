import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import api from "../../api";

export default function WinnerBidDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = `${import.meta.env.VITE_API_URL}/admin/winner-bids/${id}`;

  useEffect(() => {
    const fetchWinnerDetails = async () => {
      try {
        const res = await axios.get(BASE_URL);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError(res.data.message || "Winner not found");
        }
      } catch (e) {
        setError("Failed to fetch winner details");
      } finally {
        setLoading(false);
      }
    };
    fetchWinnerDetails();
  }, [id]);

  const handleMarkPaid = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/mark-paid`);
      if (res.data.success) {
        alert("✅ Payment marked as completed!");
      } else {
        alert("❌ Failed to update payment status");
      }
    } catch {
      alert("Error marking as paid");
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading details...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <img
              src={data.images?.[0] || `${import.meta.env.VITE_API_URL}/photos/${data.image1_url}`}
              alt={data.itemName}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex gap-2 mt-2">
              {data.images?.slice(1).map((img, i) => (
                <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                  <img
                    src={img}
                    alt={`Extra ${i + 2}`}
                    className="w-16 h-16 object-cover rounded-md border hover:opacity-80 transition"
                  />
                </a>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mt-3">{data.itemName}</h2>
            <p className="text-gray-700">{data.itemDesc}</p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div><b>Item ID:</b> {data.id}</div>
              <div><b>Win Date:</b> {new Date(data.winDate).toLocaleString()}</div>
              <div><b>Winning Amount:</b> ₹{data.winningAmount?.toLocaleString()}</div>
              <div>
                <b>Invoice:</b>{" "}
                <a
                  href={data.invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  Download
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Winner</div>
              <div className="font-medium">{data.winnerName}</div>
              <div className="text-sm text-gray-600">{data.winnerEmail}</div>
              <div className="text-sm text-gray-600">{data.winnerPhone}</div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleMarkPaid}
                className="flex items-center gap-2 justify-center px-4 py-2 bg-green-600 text-white rounded-xl"
              >
                <CheckCircle size={16} /> Mark Paid
              </button>
              <a
                href={data.invoiceUrl}
                className="flex items-center gap-2 justify-center px-4 py-2 border rounded-xl"
                target="_blank"
                rel="noreferrer"
              >
                <FileText size={16} /> View/Download Invoice
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
