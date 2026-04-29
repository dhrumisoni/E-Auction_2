import { useEffect, useState } from "react";
import api from "../../../api";
import { Archive, Search as SearchIcon, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function BidsHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/bid-history`); // ✅ adjust if API base changes
        if (!res.ok) throw new Error("Failed to fetch bids history");
        const data = await res.json();

        if (data.success) {
          // Transform backend data into frontend-friendly format
          const formatted = data.data.map((w) => ({
            itemId: w.bid?.id || "N/A",
            itemName: w.bid?.title || "Unknown Item",
            thumbnail: `${import.meta.env.VITE_API_URL}/photos/${w.bid.image1_url}`,
            finalPrice: w.transaction?.amount || w.bid?.price || 0,
            currency: "INR",
            winnerName: `${w.user?.name || ""} ${w.user?.surname || ""}`.trim(),
            winnerId: w.user?.id || "N/A",
            startAt: w.bid?.start_date || null,
            endAt: w.bid?.end_date || null,
          }));
          setHistory(formatted);
          setError(null);
        } else {
          setError(data.message || "No history found.");
        }
      } catch (e) {
        console.error("Error loading bids history:", e);
        setError("Failed to load bids history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 🗑️ Delete a completed bid
  const handleDelete = async (bidId) => {
    if (!window.confirm(`Are you sure you want to permanently delete Bid #${bidId} and all its related data (bid logs, winners, auto-bids)?\n\nThis action cannot be undone.`)) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/delete-bid/${bidId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setHistory((prev) => prev.filter((h) => h.itemId !== bidId));
        alert("✅ Bid deleted successfully!");
      } else {
        alert(`❌ Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Network error while deleting bid.");
    }
  };

  // 🔍 Filter logic
  const filtered = history.filter(
    (h) =>
      h.itemName.toLowerCase().includes(q.toLowerCase()) ||
      h.itemId.toString().toLowerCase().includes(q.toLowerCase()) ||
      (h.winnerName && h.winnerName.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0b3d91] flex items-center gap-3">
            <Archive size={24} /> Bids History
          </h1>
          <p className="text-sm text-gray-600">
            Completed auctions — view final price, winner and participants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow">
            <SearchIcon size={16} className="text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by item, id or winner..."
              className="ml-2 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          Loading completed auctions...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-gray-600">
              No completed auctions found.
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((h) => (
                <div
                  key={h.itemId}
                  className="bg-white shadow-lg rounded-xl p-4 flex gap-4 items-center"
                >
                  <img
                    src={h.thumbnail}
                    alt={h.itemName}
                    className="w-36 h-24 object-cover rounded-md border"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {h.itemName}
                        </h2>
                        <div className="text-sm text-gray-500">
                          ID: {h.itemId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Winner:{" "}
                          <span className="font-medium">{h.winnerName}</span>
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-600">
                        <div>
                          Final:{" "}
                          <span className="font-semibold">
                            ₹{h.finalPrice.toLocaleString()} {h.currency}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          Ended:{" "}
                          {h.endAt
                            ? new Date(h.endAt).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/bids-history/${h.itemId}`}
                        className="flex items-center gap-2 px-3 py-2 bg-[#0b3d91] text-white rounded-lg hover:bg-[#0a2e70] transition-colors"
                      >
                        <Eye size={16} /> View History
                      </Link>
                      <button
                        onClick={() => handleDelete(h.itemId)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
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
