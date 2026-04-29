// src/admin/Pages/BidLogDetails.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Filter, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

/**
 * BidLogDetails shows chronological bid history for a single item.
 * Replace mocked data with real fetch to: GET /api/admin/bid-logs/:itemId
 */

function toCSV(rows) {
  const header = ["bidId", "userId", "userName", "userEmail", "amount", "timestamp"];
  const lines = [header.join(",")].concat(
    rows.map((r) =>
      [
        `"${r.bidId}"`,
        `"${r.userId}"`,
        `"${r.userName}"`,
        `"${r.userEmail}"`,
        r.amount,
        `"${new Date(r.timestamp).toISOString()}"`,
      ].join(",")
    )
  );
  return lines.join("\n");
}

export default function BidLogDetails() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [q, setQ] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    // Replace this mock with a real fetch(`/api/admin/bid-logs/${itemId}`)
    const timer = setTimeout(() => {
      try {
        const mockItem = {
          itemId,
          itemName: itemId === "item-1001" ? "Antique Gold Coin" : "Sample Item",
          thumbnail: "https://via.placeholder.com/600x300",
          description: "Sample description for the item.",
        };

        const mockBids = [
          { bidId: "b1", userId: "u1", userName: "Amit", userEmail: "amit@example.com", amount: 100000, timestamp: "2025-10-05T08:00:00.000Z" },
          { bidId: "b2", userId: "u2", userName: "Rohit", userEmail: "rohit@example.com", amount: 105000, timestamp: "2025-10-05T08:15:00.000Z" },
          { bidId: "b3", userId: "u3", userName: "Priya", userEmail: "priya@example.com", amount: 110000, timestamp: "2025-10-05T09:00:00.000Z" },
          { bidId: "b4", userId: "u1", userName: "Amit", userEmail: "amit@example.com", amount: 120000, timestamp: "2025-10-05T09:40:00.000Z" },
          { bidId: "b5", userId: "u4", userName: "Rahul", userEmail: "rahul@example.com", amount: 125000, timestamp: "2025-10-05T10:20:00.000Z" },
        ];

        setItem(mockItem);
        setBids(mockBids);
        setError(null);
      } catch (e) {
        setError("Failed to load bid log.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [itemId]);

  const filtered = useMemo(() => {
    let rows = bids.slice();

    if (q.trim()) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.userName && r.userName.toLowerCase().includes(s)) ||
          (r.userEmail && r.userEmail.toLowerCase().includes(s)) ||
          (r.userId && r.userId.toLowerCase().includes(s))
      );
    }
    if (fromDate) {
      const from = new Date(fromDate);
      rows = rows.filter((r) => new Date(r.timestamp) >= from);
    }
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      rows = rows.filter((r) => new Date(r.timestamp) <= to);
    }

    rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return rows;
  }, [bids, q, fromDate, toDate]);

  const stats = useMemo(() => {
    if (!bids || bids.length === 0) return null;
    const totalBids = bids.length;
    const uniqueBidders = new Set(bids.map((b) => b.userId)).size;
    const highest = Math.max(...bids.map((b) => b.amount));
    const lowest = Math.min(...bids.map((b) => b.amount));
    const avg = Math.round(bids.reduce((s, b) => s + b.amount, 0) / bids.length);
    return { totalBids, uniqueBidders, highest, lowest, avg };
  }, [bids]);

  const handleExportCSV = () => {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item?.itemId || "bids"}-log.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-6 text-gray-500">Loading bid log...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <motion.div className="max-w-5xl mx-auto p-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={item.thumbnail} alt={item.itemName} className="w-40 h-24 object-cover rounded-md border" />
            <div>
              <h2 className="text-2xl font-semibold">{item.itemName}</h2>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 text-right">
              <div>Total bids: <span className="font-semibold">{stats?.totalBids ?? 0}</span></div>
              <div>Unique bidders: <span className="font-semibold">{stats?.uniqueBidders ?? 0}</span></div>
              <div>Highest: <span className="font-semibold">₹{stats?.highest?.toLocaleString() ?? "-"}</span></div>
            </div>
          </div>
        </div>

        {/* Filters & export */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow">
              <SearchIcon size={16} className="text-gray-400" />
              <input placeholder="Search bidder name or email..." value={q} onChange={(e) => setQ(e.target.value)} className="ml-2 outline-none text-sm" />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Filter size={16} />
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-2 py-1 border rounded" />
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 border rounded-lg">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Bid list */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="p-6 text-gray-600">No bids match the selected filters.</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((b) => (
                <div key={b.bidId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">{new Date(b.timestamp).toLocaleString()}</div>
                    <div className="text-base font-medium">{b.userName} <span className="text-sm text-gray-500">({b.userEmail})</span></div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold">₹{b.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">UID: {b.userId} • Bid ID: {b.bidId}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
