import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, ArrowLeft, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Authenticating Admin...");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminId", data.admin.id);
        localStorage.setItem("adminRole", data.admin.role);
        localStorage.setItem("adminName", data.admin.name);

        toast.success("Access Granted. Welcome, Admin.", { id: loadingToast });
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message || "Invalid Admin Credentials", { id: loadingToast });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server connection failed.", { id: loadingToast });
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#fdf8f5] relative overflow-hidden selection:bg-[#056973]/20 neural-grid">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#056973]/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0fc9db]/5 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-white rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.08)] p-12 relative z-10 glass-premium overflow-hidden"
      >
        <div className="neural-corner corner-tl"></div>
        <div className="neural-corner corner-br"></div>
        <div className="scan-line"></div>
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-20 h-20 bg-[#056973] rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-[#056973]/20"
          >
            <Shield size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight text-glow">Admin <span className="text-[#056973]">Console</span></h1>
          <p className="text-slate-400 font-medium mt-2">Secure access for platform administrators.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#056973] transition-all" size={20} />
            <input
              type="email"
              placeholder="Admin Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-50 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#056973] transition-all" size={20} />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-50 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#056973] text-white rounded-full font-black uppercase tracking-widest hover:bg-[#04565e] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#056973]/20 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : <>Access System <LogIn size={20} /></>}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-[#056973] transition-colors"
          >
            <ArrowLeft size={14} /> Global Exit To Home
          </button>
        </div>

        {/* Security Badge */}
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center opacity-30">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Secure Protocol v2.4 Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
