import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api";
import {
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  IndianRupee,
  Activity,
  Box,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestedBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequestedBids = async () => {
      try {
        const res = await api.get("/admin/requested-bids", {
          withCredentials: true,
        });
        setBids(res.data.data || []);
      } catch (error) {
        console.error("Error fetching requested bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestedBids();
  }, []);

  const approveBid = async (id) => {
    try {
      const res = await api.put("/admin/approve-bid/${id}", {}, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMessage("✅ Bid approved successfully!");
        setTimeout(() => setMessage(""), 3000);
        setBids((prev) => prev.filter((bid) => bid.id !== id));
      }
    } catch (error) {
      console.error("Error approving bid:", error);
      setMessage("❌ Failed to approve bid");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const rejectBid = async (id) => {
    try {
      const res = await api.put("/admin/reject-bid/${id}", {}, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMessage("⚠️ Bid rejected successfully");
        setTimeout(() => setMessage(""), 3000);
        setBids((prev) => prev.filter((bid) => bid.id !== id));
      }
    } catch (error) {
      console.error("Error rejecting bid:", error);
      setMessage("❌ Failed to reject bid");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleNextImage = (bidId, images) => {
    setCurrentImageIndex((prev) => {
      const current = prev[bidId] || 0;
      const next = (current + 1) % images.length;
      return { ...prev, [bidId]: next };
    });
  };

  const handlePrevImage = (bidId, images) => {
    setCurrentImageIndex((prev) => {
      const current = prev[bidId] || 0;
      const next = (current - 1 + images.length) % images.length;
      return { ...prev, [bidId]: next };
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#f8fafc] neural-grid">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#056973] border-t-transparent rounded-full mb-4 shadow-xl"
        />
        <p className="text-lg font-black text-[#056973] tracking-[0.2em] uppercase">Syncing Registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[#f8fafc] neural-grid custom-scrollbar">
      {/* Success/Failure Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "50%" }}
            animate={{ opacity: 1, y: 20, x: "0%" }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 right-4 z-[100] bg-gradient-to-r from-[#056973] to-[#0fc9db] text-white px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3 backdrop-blur-xl border border-white/20"
          >
            <ShieldCheck size={24} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="mb-12 relative">
        <div className="flex items-center gap-4 mb-2">
          <Activity className="text-[#056973] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#056973]/60">Admin Security Layer</span>
        </div>
        <h1 className="text-5xl font-black text-[#056973] tracking-tighter text-glow">Requested <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Bids</span></h1>
        <p className="text-slate-500 mt-2 font-medium max-w-xl">
          Validate and authorize seller-submitted assets for the neural auction grid.
        </p>
      </div>

      {/* Bids List */}
      {bids.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-20 glass-premium rounded-[3rem] border border-dashed border-slate-200"
        >
          <div className="p-6 bg-slate-50 rounded-full mb-6">
            <Box size={48} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-400">Registry Is Empty</h3>
          <p className="text-slate-300 text-sm">No pending bid authorizations found at this time.</p>
        </motion.div>
      ) : (
        <div className="grid gap-8">
          {bids.map((bid, index) => {
            const images = [
              bid.image1_url,
              bid.image2_url,
              bid.image3_url,
              bid.image4_url,
            ].filter(Boolean);

            const currentIndex = currentImageIndex[bid.id] || 0;
            const currentImage = images[currentIndex];

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={bid.id}
                className="glass-premium rounded-[3rem] p-8 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden group"
              >
                <div className="neural-corner corner-tl opacity-30"></div>
                <div className="neural-corner corner-br opacity-30"></div>
                <div className="scan-line opacity-10"></div>

                {/* Image Carousel */}
                <div className="relative w-full lg:w-64 h-64 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group-hover:scale-[1.02] transition-transform duration-500 neon-glow-pulse">
                  {currentImage ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/photos/bidsphotos/${currentImage}`}
                      alt={`${bid.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <Box size={40} />
                    </div>
                  )}

                  {images.length > 1 && (
                    <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2 px-4">
                      <button
                        onClick={() => handlePrevImage(bid.id, images)}
                        className="p-2 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => handleNextImage(bid.id, images)}
                        className="p-2 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-[#056973]/10 text-[#056973] text-[9px] font-black uppercase tracking-widest rounded-lg">
                        {bid.category?.name || "Uncategorized"}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase">
                        <AlertCircle size={10} /> Pending Verification
                      </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{bid.title}</h2>
                    <p className="text-slate-400 font-medium mt-1 flex items-center gap-2">
                      Authentication ID: <span className="text-[#056973] font-bold">#USR-{bid.user?.id || "???"}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Submitted By</p>
                      <p className="font-bold text-slate-700">{bid.user?.name || "Neural User"}</p>
                    </div>
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Value</p>
                      <p className="font-bold text-teal-600 flex items-center gap-1">
                        <IndianRupee size={14} /> {bid.price?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline & Actions */}
                <div className="lg:w-72 w-full space-y-6 border-l border-slate-100 pl-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                      <Calendar size={16} className="text-teal-500" />
                      <span>Starts: {bid.start_date ? new Date(bid.start_date).toLocaleDateString("en-GB") : "—"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                      <Calendar size={16} className="text-rose-400" />
                      <span>Ends: {bid.end_date ? new Date(bid.end_date).toLocaleDateString("en-GB") : "—"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={() => approveBid(bid.id)}
                      className="w-full py-4 bg-[#056973] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#056973]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Authorize Listing
                    </button>
                    <button
                      onClick={() => rejectBid(bid.id)}
                      className="w-full py-4 bg-white text-rose-500 border-2 border-rose-50 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Deny Access
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
