import React, { useEffect, useState } from "react";
import api from "../../../api";
import { Mail, User, Clock, Trash2, CheckCircle, Search, Filter, Inbox as InboxIcon, ArrowRight, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/contact-messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Error loading inbox:", err);
      toast.error("Failed to load inbox messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/contact-messages/${id}/read`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message marked as read");
        setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/contact-messages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message deleted");
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSending(true);
    const loadingToast = toast.loading("Dispatching secure reply...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/contact-messages/${replyingTo.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Reply dispatched successfully", { id: loadingToast });
        setMessages(messages.map(m => m.id === replyingTo.id ? { ...m, status: 'replied' } : m));
        setReplyingTo(null);
        setReplyMessage("");
      } else {
        toast.error(data.message || "Failed to send reply", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error during transmission", { id: loadingToast });
    } finally {
      setIsSending(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" ? true : msg.status === filter;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#056973]/20 border-t-[#056973] rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Inbox...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#056973] text-white rounded-2xl shadow-lg shadow-[#056973]/20">
              <InboxIcon size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Admin <span className="text-[#056973]">Inbox</span></h1>
          </div>
          <p className="text-slate-500 font-medium ml-12">
            Manage user inquiries and community feedback.
            {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white text-[10px] rounded-full font-black uppercase tracking-tighter animate-pulse">{unreadCount} New</span>}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#056973] transition-all" size={18} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-[#056973] focus:ring-4 focus:ring-[#056973]/5 transition-all text-sm font-medium text-slate-700 w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-[#056973] transition-all text-sm font-black text-slate-600 appearance-none cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Items</option>
            <option value="unread">Unread</option>
            <option value="read">Processed</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Mail size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-400 tracking-tight mb-2">No transmissions found</h3>
              <p className="text-slate-300 text-sm font-medium">Your global inbox is currently clear.</p>
            </motion.div>
          ) : (
            filteredMessages.map((msg, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={msg.id}
                className={`group relative bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden ${msg.status === 'unread' ? 'border-l-4 border-l-[#056973] border-slate-100 shadow-sm' : 'border-slate-100 opacity-80'}`}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${msg.status === 'unread' ? 'bg-[#056973] text-white shadow-xl shadow-[#056973]/20' : 'bg-slate-100 text-slate-400'}`}>
                        <User size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-[#056973] transition-colors">{msg.name}</h2>
                        <div className="flex items-center gap-3 mt-1 text-slate-400 font-medium text-sm">
                          <span className="flex items-center gap-1.5"><Mail size={14} /> {msg.email}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${msg.status === 'unread' ? 'bg-rose-50 text-rose-500 border-rose-100' : msg.status === 'replied' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                        {msg.status === 'unread' ? 'Unread Signal' : msg.status === 'replied' ? 'Replied' : 'Verified'}
                      </div>
                      <div className="h-8 w-[1px] bg-slate-100 hidden lg:block mx-2" />
                      <div className="flex items-center gap-2">
                        {msg.status === 'unread' && (
                          <button
                            onClick={() => markAsRead(msg.id)}
                            className="p-3 bg-slate-50 text-slate-400 hover:bg-[#056973] hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg"
                            title="Mark as Read"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg"
                          title="Purge Message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="relative mb-6">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-50 rounded-full" />
                    <div className="pl-8 py-2">
                      <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line text-base">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Message Footer */}
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <span>Ref ID: MSG-{msg.id.toString().padStart(4, '0')}</span>
                    </div>
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="text-[10px] font-black text-[#056973] uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform group/btn"
                    >
                      Secure Reply <ArrowRight size={14} className="transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-[#056973] p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Send size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Secure Reply</h2>
                    <p className="text-white/60 text-sm font-medium">To: {replyingTo.email}</p>
                  </div>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={sendReply} className="p-8">
                <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Original Message</p>
                  <p className="text-slate-500 text-sm italic font-medium line-clamp-2">"{replyingTo.message}"</p>
                </div>

                <label className="block text-[10px] font-black text-[#056973] uppercase tracking-widest mb-3 ml-2">Response Content</label>
                <textarea
                  autoFocus
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your secure response here..."
                  className="w-full h-48 p-6 bg-slate-50 border-2 border-transparent focus:border-[#056973]/20 focus:bg-white outline-none rounded-3xl transition-all font-medium text-slate-700 resize-none"
                />

                <div className="mt-8 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-8 py-3.5 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSending}
                    type="submit"
                    className="px-10 py-3.5 bg-[#056973] text-white rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-[#056973]/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-3"
                  >
                    {isSending ? "Dispatching..." : <>Send Response <Send size={14} /></>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between opacity-40">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">© Neural eAuction Inbox System v2.2</p>
      </div>
    </div>
  );
}
