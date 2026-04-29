import { useEffect, useState } from "react";
import api from "../../api";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileDown, Crown } from "lucide-react";

export default function BidsHistoryDetails() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch winner + bid logs
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res1 = await fetch(`${import.meta.env.VITE_API_URL}/admin/bid-history/${itemId}`);
        const winnerData = await res1.json();

        const res2 = await fetch(`${import.meta.env.VITE_API_URL}/admin/bid-history/${itemId}/logs`);
        const logsData = await res2.json();

        if (winnerData.success) setItem(winnerData.data);
        if (logsData.success) setBids(logsData.data);
      } catch (error) {
        console.error("Error fetching bid details:", error);
        setError("Failed to fetch bid details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [itemId]);

  // ✅ CSV Export Function
  const exportCSV = () => {
    const csvRows = [
      ["Name", "Email", "Bid Amount", "Date"],
      ...bids.map((b) => [
        `${b.user?.name || ""} ${b.user?.surname || ""}`.trim(),
        b.user?.email || "",
        b.price || "",
        new Date(b.createdAt).toLocaleString(),
      ]),
    ];
    const csvData = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item?.bid?.title || "bids"}_history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Summary calculations
  const summary = {
    totalParticipants: new Set(bids.map((b) => b.user?.id)).size,
    totalBids: bids.length,
    highestBid: bids.length ? Math.max(...bids.map((b) => b.price || 0)) : 0,
    lowestBid: bids.length ? Math.min(...bids.map((b) => b.price || 0)) : 0,
  };

  // ✅ Loading / Error / Empty states
  if (loading)
    return <div className="p-6 bg-white rounded-xl shadow text-gray-500">Loading bid details...</div>;
  if (error)
    return <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl">{error}</div>;
  if (!item)
    return <div className="p-6 bg-white rounded-xl shadow text-gray-600">No bid details found.</div>;

  // ✅ Winner ID for highlight
  const winnerId = item?.user?.id;

  return (
    <div className="p-6 space-y-6">
      {/* 🔙 Back + Export */}
      <div className="flex items-center justify-between">
        <Link to="/admin/bids-history" className="flex items-center gap-2 text-[#0b3d91] hover:underline">
          <ArrowLeft size={18} /> Back to History
        </Link>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#0b3d91] text-white rounded-lg shadow"
        >
          <FileDown size={16} /> Export CSV
        </button>
      </div>

      {/* 🧾 Quick Summary */}
      <div className="bg-white rounded-xl shadow p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div>
          <p className="text-gray-500 text-sm">Total Participants</p>
          <p className="text-lg font-semibold">{summary.totalParticipants}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Bids</p>
          <p className="text-lg font-semibold">{summary.totalBids}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Highest Bid</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{summary.highestBid.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Lowest Bid</p>
          <p className="text-lg font-semibold text-red-600">
            ₹{summary.lowestBid.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 🏆 Winner & Item Info */}
      <div className="bg-white rounded-xl shadow p-6 flex gap-6">
        <img
          src={
            item?.bid?.image1_url
              ? `${import.meta.env.VITE_API_URL}/photos/${item.bid.image1_url}`
              : "https://via.placeholder.com/200"
          }
          alt={item?.bid?.title}
          className="w-48 h-36 object-cover rounded-lg border"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800">{item?.bid?.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {item?.bid?.description || "No description available."}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div><strong>Status:</strong> {item?.bid?.status || "N/A"}</div>
            <div><strong>Base Price:</strong> ₹{item?.bid?.price?.toLocaleString() || "0"}</div>
            <div><strong>Start:</strong> {item?.bid?.start_date ? new Date(item.bid.start_date).toLocaleString() : "N/A"}</div>
            <div><strong>End:</strong> {item?.bid?.end_date ? new Date(item.bid.end_date).toLocaleString() : "N/A"}</div>
          </div>

          {/* Winner Info */}
          <div className="mt-4 border-t pt-3">
            <h2 className="text-lg font-semibold text-[#0b3d91] flex items-center gap-1">
              <Crown size={18} className="text-yellow-500" /> Winner
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              {item?.user ? `${item.user.name} ${item.user.surname || ""}` : "No winner"}
            </p>
            <p className="text-sm text-gray-500">{item?.user?.email}</p>
            <p className="text-sm text-gray-500">{item?.user?.number}</p>
            <p className="text-sm mt-1">
              Final Amount:{" "}
              <strong className="text-green-600">
                ₹{item?.transaction?.amount ? item.transaction.amount.toLocaleString() : "0"}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* 📜 Bid Logs Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">All Bids Placed</h2>

        {bids.length === 0 ? (
          <p className="text-gray-500 text-sm">No bid logs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Bidder Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Bid Amount</th>
                  <th className="px-4 py-2 text-left">Placed At</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((b, i) => {
                  const isWinner = b.user?.id === winnerId && b.price === item?.transaction?.amount;
                  return (
                    <tr
                      key={i}
                      className={`border-t transition-all ${
                        isWinner
                          ? "bg-yellow-50 border-yellow-300 font-semibold"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-2 flex items-center gap-2">
                        {isWinner && <Crown size={14} className="text-yellow-500" />}
                        {b.user ? `${b.user.name} ${b.user.surname || ""}` : "Unknown"}
                      </td>
                      <td className="px-4 py-2">{b.user?.email || "-"}</td>
                      <td className="px-4 py-2 text-green-600 font-semibold">
                        ₹{b.price ? b.price.toLocaleString() : "0"}
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
