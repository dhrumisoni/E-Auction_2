import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api";
import { Trophy, Eye, Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function WinnerBids() {
  const [loading, setLoading] = useState(true);
  const [winnerBids, setWinnerBids] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await api.get("/admin/winner-bids");
        if (res.data.success) {
          setWinnerBids(res.data.data);
        } else {
          setError("No winner data found.");
        }
      } catch (err) {
        console.error("Error fetching winner bids:", err);
        setError("Failed to load winner bids.");
      } finally {
        setLoading(false);
      }
    };
    fetchWinners();
  }, []);

  const handleDelete = async (bidId) => {
    if (!window.confirm(`Are you sure you want to permanently delete Bid #${bidId} and all its related data (bid logs, winners, auto-bids)?\n\nThis action cannot be undone.`)) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/delete-bid/${bidId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setWinnerBids((prev) => prev.filter((wb) => wb.bidId !== bidId));
        alert("✅ Bid deleted successfully!");
      } else {
        alert(`❌ Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Network error while deleting bid.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0b3d91] flex items-center gap-3">
          <Trophy size={22} /> Winner Bids
        </h1>
        <div className="text-sm text-gray-600">{winnerBids.length} results</div>
      </div>

      {loading && (
        <div className="bg-white rounded-xl p-6 shadow text-gray-500">
          Loading winner bids...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {winnerBids.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow text-gray-600">
              No winner bids found.
            </div>
          ) : (
            <div className="grid gap-6">
              {winnerBids.map((wb) => (
                <div
                  key={wb._id}
                  className="bg-white shadow-lg rounded-xl p-4 flex gap-6 items-center hover:shadow-xl transition"
                >
                  {/* 🖼️ Image Section */}
                  <div className="flex flex-col items-center">
                    {/* Main Image Clickable */}
                    <a
                      href={wb.images?.[0] || "https://via.placeholder.com/160"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={wb.images?.[0] || "https://via.placeholder.com/160"}
                        alt={wb.itemName}
                        className="w-36 h-28 object-cover rounded-lg border mb-2 cursor-pointer hover:opacity-80 transition"
                      />
                    </a>

                    {/* Thumbnails */}
                    <div className="flex gap-1">
                      {wb.images?.slice(1).map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={img}
                            alt={`Image ${i + 2}`}
                            className="w-10 h-10 object-cover rounded-md border cursor-pointer hover:opacity-80 transition"
                          />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* 🏆 Winner Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {wb.itemName}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Winner:{" "}
                          <span className="font-medium">{wb.winnerName}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Amount:{" "}
                          <span className="font-semibold">
                            ₹{wb.winningAmount?.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Won on:{" "}
                          <span>
                            {wb.endDate
                              ? new Date(wb.endDate).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </span>
                        </p>
                      </div>

                      <div className="text-right text-sm text-gray-500">
                        <div>{wb.winnerEmail}</div>
                        <div className="mt-1">{wb.winnerPhone}</div>
                      </div>
                    </div>
                  </div>

                  {/* 📄 Actions */}
                  <div className="flex flex-col items-end gap-2">
                  <Link
                    to={`/admin/winner-bids/${wb.id}`}   // ✅ Change from wb._id to wb.id
                    className="flex items-center gap-2 px-3 py-2 bg-[#0b3d91] text-white rounded-lg hover:bg-[#092f73] transition"
                    >
                    <Eye size={16} /> View
                    </Link>


                    <a
                      href={wb.invoiceUrl}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100 transition"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download size={16} /> Invoice
                    </a>

                    <button
                      onClick={() => handleDelete(wb.bidId)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
