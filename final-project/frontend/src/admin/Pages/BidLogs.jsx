// src/admin/Pages/BidLogs.jsx
import { useEffect, useState } from "react";
import { List, Search as SearchIcon, Activity, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function BidLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Replace this mock with: fetch('/api/admin/bid-logs') ...
    const timer = setTimeout(() => {
      try {
        const mock = [
          {
            itemId: "item-1001",
            itemName: "Antique Gold Coin",
            thumbnail: "https://via.placeholder.com/160",
            highestBid: 125000,
            totalBids: 8,
            uniqueBidders: 6,
            lastBidAt: "2025-10-05T10:20:00.000Z",
          },
          {
            itemId: "item-2002",
            itemName: "Vintage Car - Model X",
            thumbnail: "https://via.placeholder.com/160",
            highestBid: 850000,
            totalBids: 12,
            uniqueBidders: 9,
            lastBidAt: "2025-09-28T15:45:00.000Z",
          },
        ];
        setLogs(mock);
        setError(null);
      } catch (e) {
        setError("Failed to load bid logs.");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.itemName.toLowerCase().includes(query.toLowerCase()) ||
      l.itemId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0b3d91] flex items-center gap-3">
            <List size={22} /> Bids Logs
          </h1>
          <p className="text-sm text-gray-600">View bidding activity per item — bidders, timestamps and amounts.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow">
            <SearchIcon size={16} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search item name or id..."
              className="ml-2 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {loading && <div className="bg-white p-6 rounded-xl shadow text-gray-500">Loading bid logs...</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}</div>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-gray-600">No auctions found.</div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((item) => (
                <div key={item.itemId} className="bg-white shadow-lg rounded-xl p-4 flex items-center gap-4">
                  <img src={item.thumbnail} alt={item.itemName} className="w-36 h-24 object-cover rounded-md border" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{item.itemName}</h2>
                        <div className="text-sm text-gray-500">ID: {item.itemId}</div>
                      </div>

                      <div className="text-right text-sm text-gray-600">
                        <div>Highest: <span className="font-semibold">₹{item.highestBid.toLocaleString()}</span></div>
                        <div>Total bids: {item.totalBids}</div>
                        <div>Unique bidders: {item.uniqueBidders}</div>
                        <div className="mt-1 text-xs text-gray-400">{new Date(item.lastBidAt).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Link to={`/admin/bid-logs/${item.itemId}`} className="flex items-center gap-2 px-3 py-2 bg-[#0b3d91] text-white rounded-lg">
                        <Eye size={16} /> View Log
                      </Link>
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
