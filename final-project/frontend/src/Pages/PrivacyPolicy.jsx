import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShieldCheck, Lock, Eye, Users, Cookie, Scale, HelpCircle, RefreshCw, Mail, Phone, ChevronRight, FileText
} from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      icon: <FileText size={24} />,
      title: "Information We Collect",
      color: "text-blue-500",
      bg: "bg-blue-50",
      content: [
                "Personal details including your name, verified phone number, and hierarchical city/state data when you register.",
        "Bidding activity including real-time bid logs, auction watchlists, and automated proxy bid configurations.",
        "Interaction history with our Neural AI interface to improve response accuracy.",
        "Identity verification documents uploaded for secure bid participation.",
      ],
    },
    {
      icon: <Eye size={24} />,
      title: "How We Use Data",
      color: "text-[#056973]",
      bg: "bg-teal-50",
      content: [
                "To facilitate real-time bidding, automated proxy bidding, and auction lifecycle management.",
        "To process secure transactions and prevent fraudulent activity across the network.",
        "To provide AI-powered assistance for project navigation and feature queries.",
        "To maintain hierarchical location verification and secure user identity status.",
      ],
    },
    {
      icon: <Lock size={24} />,
      title: "Data Security",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      content: [
        "We implement industry-standard encryption (SSL/TLS) for all data transmission.",
                "Payment data is processed through secure PayPal gateways and is never stored on our servers.",
        "Access to personal data is restricted to authorized personnel only.",
        "Regular security audits are conducted to safeguard your information.",
      ],
    },
    {
      icon: <Users size={24} />,
      title: "Information Sharing",
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      content: [
        "We share buyer/seller details only after a successful auction to facilitate delivery.",
        "Data may be shared with trusted third-party providers for payment and analytics.",
        "We will disclose information if required by law or to protect legal rights.",
        "We do not sell, rent, or trade your personal information to third parties.",
      ],
    },
    {
      icon: <Cookie size={24} />,
      title: "Cookies & Tracking",
      color: "text-amber-500",
      bg: "bg-amber-50",
      content: [
        "We use essential cookies to keep you logged in and remember your session.",
        "Analytics cookies help us understand user interaction to improve experience.",
        "You can manage cookies through your browser settings at any time.",
      ],
    },
    {
      icon: <Scale size={24} />,
      title: "Your Rights",
      color: "text-rose-500",
      bg: "bg-rose-50",
      content: [
        "Access, update, or delete your personal info via Profile settings.",
        "Request a copy of all data we hold about you via our support team.",
        "Withdraw consent for non-essential data processing at any time.",
        "Opt out of promotional emails using the unsubscribe link provided.",
      ],
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Children's Privacy",
      color: "text-cyan-500",
      bg: "bg-cyan-50",
      content: [
        "eAuction is not intended for users under the age of 18.",
        "We do not knowingly collect personal data from minors.",
        "If a minor's data is discovered, we will promptly delete it from our systems.",
      ],
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Policy Updates",
      color: "text-slate-500",
      bg: "bg-slate-50",
      content: [
        "We may update this policy to reflect changes in practices or laws.",
        "Significant changes will be communicated via email or platform notice.",
        "Continued use after updates constitutes acceptance of the revised policy.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans selection:bg-[#056973] selection:text-white">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 text-white pt-12 pb-32 px-6 md:px-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-blue-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[100%] bg-teal-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white font-bold mb-16 transition-all bg-white/5 px-6 py-2.5 rounded-full border border-white/10"
          >
            <ArrowLeft size={18} />
            Control Center
          </motion.button>
          
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
                PRIVACY <span className="text-teal-400">MANIFESTO</span>
              </h1>
              <p className="text-slate-400 text-xl font-bold leading-relaxed uppercase tracking-widest">
                Our protocol for data transparency and user protection.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-right hidden lg:block">
              <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-1">Version Control</p>
                                          <p className="text-lg font-black tracking-tighter">2026</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-6 hidden lg:block sticky top-8 h-fit">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Table of Contents</h3>
              <div className="space-y-2">
                {sections.map((section, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSection(i)}
                    className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-between group
                      ${activeSection === i ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <span>{section.title}</span>
                    <ChevronRight size={14} className={activeSection === i ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-teal-500 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <ShieldCheck size={32} className="mb-6" />
              <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Trust Standard</h4>
              <p className="text-teal-50/70 text-xs font-bold leading-relaxed">
                eAuction uses bank-grade encryption to ensure your data never falls into the wrong hands.
              </p>
            </div>
          </div>

          {/* Policy Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-slate-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-6 ${sections[activeSection].bg} rounded-[1.8rem] ${sections[activeSection].color}`}>
                      {sections[activeSection].icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{sections[activeSection].title}</h2>
                      <div className="h-1.5 w-16 bg-teal-500 rounded-full mt-2"></div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {sections[activeSection].content.map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-6 items-start"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2.5 shadow-[0_0_8px_#2dd4bf]"></div>
                        <p className="text-slate-600 text-lg font-bold leading-relaxed flex-1">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Contact Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-[3.5rem] p-12 border border-slate-100 flex flex-col md:flex-row items-center gap-12"
            >
              <div className="p-8 bg-white rounded-[2.5rem] shadow-xl text-[#056973]">
                <HelpCircle size={48} />
              </div>
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Still have queries?</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Our data protection officer is ready to assist.</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <a href="mailto:support@eauction.com" className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 text-slate-900 font-black text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm group">
                    <Mail size={16} className="text-teal-500 group-hover:text-teal-400" /> support@eauction.com
                  </a>
                  <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 text-slate-900 font-black text-xs shadow-sm">
                    <Phone size={16} className="text-teal-500" /> +1 234 567 890
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Navigation (Visible only on mobile) */}
            <div className="lg:hidden grid grid-cols-2 gap-4">
              {sections.map((section, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSection(i);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`p-6 rounded-[2rem] text-center transition-all border ${activeSection === i ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-100 shadow-lg'}`}
                >
                  <div className="flex justify-center mb-3">{section.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">{section.title}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
