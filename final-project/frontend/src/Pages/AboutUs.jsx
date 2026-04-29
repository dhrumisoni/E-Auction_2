import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Target, Eye, Rocket, Zap, ShieldCheck, Users, Globe, Cpu, Database, Layout, Smartphone, TrendingUp, BarChart, Heart, Award, CheckCircle2
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20 font-sans selection:bg-[#056973] selection:text-white">
      
      {/* Elegant Minimalist Hero */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img 
          src="/about_us_hero_1776841617726.png" 
          alt="About Us Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="mb-12 inline-flex items-center gap-2 text-[#056973] font-black uppercase tracking-widest text-xs bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-slate-100"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8"
          >
            Crafting <span className="text-[#056973]">Excellence.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-600 text-xl md:text-2xl font-bold leading-relaxed max-w-2xl mx-auto"
          >
            eAuction is more than a platform; it's a commitment to transparency, fairness, and the pursuit of value.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-32">
        
        {/* Mission & Vision - Clean Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="h-1.5 w-16 bg-[#056973] rounded-full"></div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Our Mission</h2>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed">
              We exist to democratize the auction experience. By integrating advanced **Neural AI interfaces** with **Real-time Bid Logs**, we ensure that every participant has the data they need to bid with confidence.
            </p>
            <ul className="space-y-4">
                            {["AI-Powered Assistance", "Real-Time Bid Tracking", "Secure Document Vault"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-sm">
                  <CheckCircle2 size={20} className="text-[#056973]" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#056973]/5 rounded-[3rem] -rotate-3"></div>
            <div className="relative bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl">
              <Eye size={48} className="text-[#056973] mb-8" />
              <h3 className="text-3xl font-black text-slate-900 mb-6 uppercase">Our Vision</h3>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                To become the global pulse of the digital marketplace. We envision a future where **Automated Proxy Bidding** and **Instant Verification** make auctions accessible to everyone, anywhere.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-black text-[#056973] uppercase tracking-[0.4em]">The Core</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Values that drive us.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Heart className="text-rose-500" />, title: "User First", desc: "Every feature we build starts with the user's needs and safety in mind." },
              { icon: <Award className="text-amber-500" />, title: "Excellence", desc: "We strive for perfection in every line of code and every auction listing." },
              { icon: <Rocket className="text-blue-500" />, title: "Innovation", desc: "Constantly pushing the boundaries of what's possible in digital commerce." },
            ].map((v, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="text-center p-10 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-2xl"
              >
                <div className="flex justify-center mb-6">{v.icon}</div>
                <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{v.title}</h4>
                <p className="text-slate-500 font-bold leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack - Professional List */}
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px]"></div>
          <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-black tracking-tight leading-none uppercase">The Technology <br /><span className="text-teal-400">Ecosystem.</span></h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                A robust foundation built on modern standards. We leverage a high-performance stack to handle thousands of concurrent bids without a hitch.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {[
                { name: "Frontend", val: "React.js & Tailwind" },
                { name: "Backend", val: "Node & Express" },
                { name: "Database", val: "MySQL & Sequelize" },
                                { name: "Payments", val: "PayPal Integrated" },
              ].map((t, i) => (
                <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white hover:text-slate-900 transition-all duration-500">
                  <p className="text-[10px] font-black uppercase text-teal-400 mb-1 group-hover:text-[#056973] transition-colors">{t.name}</p>
                  <p className="text-sm font-black uppercase tracking-widest">{t.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-20 border-t border-slate-100 space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Ready to join our community?</h2>
          <div className="flex justify-center gap-6">
            <button 
              onClick={() => navigate("/auctions")}
              className="px-10 py-5 bg-[#056973] text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-[#056973]/30 hover:scale-105 transition-all"
            >
              Start Bidding
            </button>
            <button 
              onClick={() => navigate("/contactus")}
              className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
