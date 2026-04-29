// src/admin/Pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../api";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { motion } from "framer-motion";
import { Gavel, Users, Tag, Search } from "lucide-react";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [recentWinners, setRecentWinners] = useState([]);
  const [topAuctions, setTopAuctions] = useState([]);
  const [bidsOverTime, setBidsOverTime] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/dashboard-stats");
        if (res.data?.success) {
          setStats(res.data.stats);
          setLiveAuctions(res.data.liveAuctions || []);
          setRecentWinners(res.data.recentWinners || []);
          setTopAuctions(res.data.topAuctions || []);
          setBidsOverTime(res.data.bidsOverTime || { labels: [], data: [] });
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Search
  const [query, setQuery] = useState("");
  const filteredAuctions = liveAuctions.filter(a =>
    (a.title || "").toLowerCase().includes(query.toLowerCase()) ||
    String(a.id).includes(query)
  );

  // Time formatter
  const formatTimeLeft = (endDateStr) => {
    if (!endDateStr) return "—";
    const end = new Date(endDateStr);
    const now = new Date();
    const diff = Math.max(0, Math.floor((end - now) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Line chart
  const lineData = {
    labels: bidsOverTime.labels,
    datasets: [
      {
        label: "Bids per day",
        data: bidsOverTime.data,
        fill: true,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99,102,241,0.15)");
          gradient.addColorStop(1, "rgba(99,102,241,0)");
          return gradient;
        },
        borderColor: "#6366f1",
        borderWidth: 3,
        tension: 0.35,
      }
    ]
  };

  // Bar chart
  const barData = {
    labels: topAuctions.map(a => a.title),
    datasets: [{
      label: "Total Bids",
      data: topAuctions.map(a => a.bidCount),
      backgroundColor: ["#34d399", "#60a5fa", "#fbbf24", "#fb7185", "#a78bfa"]
    }]
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
  };

  const statCards = [
    { title: "Live Auctions", value: stats?.liveAuctions ?? 0, icon: <Gavel size={26} />, color: "from-indigo-500 to-purple-500" },
    { title: "Active Bidders", value: stats?.activeBidders ?? 0, icon: <Users size={26} />, color: "from-emerald-500 to-teal-500" },
    { title: "Total Listings", value: stats?.totalListings ?? 0, icon: <Tag size={26} />, color: "from-yellow-400 to-orange-400" },
    { title: "Completed Sales", value: stats?.completedSales ?? 0, icon: <Gavel size={26} />, color: "from-rose-500 to-pink-500" }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">E-Auction Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor auctions, analytics & performance</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border px-3 py-1 rounded-lg shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search auctions or id"
              className="text-sm outline-none ml-2"
            />
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            className={`p-5 rounded-2xl shadow-md text-white bg-gradient-to-r ${card.color} cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{card.title}</p>
                <h2 className="text-3xl font-bold mt-1">{card.value}</h2>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIVE AUCTIONS + CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LIVE AUCTIONS */}
        <motion.div whileHover={{ y: -3 }} className="bg-white rounded-xl p-4 shadow-md col-span-2">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Live Auctions</p>
              <h3 className="text-xl font-semibold text-gray-800">Active Listings</h3>
            </div>
            <p className="text-gray-500 text-sm">Updated now</p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 py-6">Loading auctions...</p>
            ) : filteredAuctions.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No active auctions</p>
            ) : (
              filteredAuctions.map(a => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-lg transition">
                  <div className="flex items-center gap-4">
                    <img
                      src={a.image1_url ? `${import.meta.env.VITE_API_URL}/photos/${a.image1_url}` : "/no-image.png"}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{a.title}</h4>
                      <p className="text-sm text-gray-500">{a.category?.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600 text-sm">{formatTimeLeft(a.end_date)}</p>
                    <Link
                      to={`/admin/active-bids/${a.id}`}
                      className="text-indigo-600 text-sm underline"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-6">
            <Link
              to="/admin/active-bids"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105"
            >
              View All Auctions →
            </Link>
          </div>
        </motion.div>

        {/* RIGHT SIDE - CHARTS */}
        <div className="space-y-6">

          {/* Line Chart */}
          <motion.div whileHover={{ y: -3 }} className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-gray-500 text-sm">Activity</p>
            <h3 className="font-semibold text-gray-800 mb-2">Bids Over Time</h3>
            <div className="h-40"><Line data={lineData} options={lineOptions} /></div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div whileHover={{ y: -3 }} className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-gray-500 text-sm">Top Auctions</p>
            <h3 className="font-semibold text-gray-800 mb-2">Most Competitive</h3>
            <div className="h-40"><Bar data={barData} /></div>
          </motion.div>

          {/* Recent Winners */}
          <motion.div whileHover={{ y: -3 }} className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-gray-500 text-sm">Recent Winners</p>
            <div className="mt-3 space-y-3">
              {recentWinners.length === 0 ? (
                <p className="text-gray-500 text-sm">No winners yet</p>
              ) : recentWinners.map((r, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{r.bid?.title}</p>
                    <p className="text-gray-500 text-xs">{r.user?.name}</p>
                  </div>
                  <p className="text-indigo-600 font-semibold">₹{r.transaction?.amount}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
