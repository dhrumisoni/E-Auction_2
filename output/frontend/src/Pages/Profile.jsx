import { useContext, useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Camera, Save, X, Edit2, ShieldCheck, AlertCircle, ArrowLeft, Search, TrendingUp, Award, Clock, Zap, Target, Activity, ChevronRight
} from "lucide-react";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, fetchUserData } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [cities, setCities] = useState([]);

  // Validation States
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    number: ""
  });

  const [stats, setStats] = useState({
    totalBids: 0,
    totalWins: 0,
    winRate: 0,
    reputation: 9.5
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      fetchUserData(user.email);
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/stats/${user.id}`);
          const data = await response.json();
          if (data.success) {
            setStats(data.stats);
            setActivities(data.activities);
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }
    };
    fetchStats();
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      setEditedUser({
        ...user,
        city_id: user.city_id?.[0]?.city_id || user.city_id,
      });
      setErrors({ name: "", surname: "", email: "", number: "" });
    }
  }, [user]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/cities`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const validateName = (name) => {
    if (!name || name.trim().length < 2) return "Must be at least 2 characters.";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Only alphabets are allowed.";
    return "";
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!re.test(email)) return "Enter a valid email address.";
    return "";
  };

  const validatePhoneNumber = (phone) => {
    const normalized = phone?.toString().replace(/[\s-()]/g, "") || "";
    if (!normalized) return "Phone number is required.";
    if (!/^\+?\d{10,15}$/.test(normalized)) return "Must be 10 to 15 digits.";
    return "";
  };

  const countryDialCodes = {
    'India': '+91',
    'United States': '+1',
    'Brazil': '+55',
    'Iran': '+98',
    'Maldives': '+960',
    'Nepal': '+977',
    'Germany': '+49',
    'Liechtenstein': '+423',
    'Luxembourg': '+352',
    'Monaco': '+377',
    'Netherlands': '+31',
    'Ethiopia': '+251',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "city_id") {
      const cityIdInt = parseInt(value, 10);
      setEditedUser((prev) => {
        const updated = { ...prev, [name]: cityIdInt };
        const selectedCity = cities.find(c => c.city_id === cityIdInt);
        if (selectedCity && selectedCity.country_name) {
          const dialCode = countryDialCodes[selectedCity.country_name];
          if (dialCode) {
            const currentPhone = (prev.number || "").toString().trim();
            if (!currentPhone || currentPhone.length <= 4) {
              updated.number = dialCode + " ";
            } else if (!currentPhone.startsWith("+")) {
              updated.number = dialCode + " " + currentPhone;
            }
            setErrors(errs => ({ ...errs, number: validatePhoneNumber(updated.number) }));
          }
        }
        return updated;
      });
    } else {
      setEditedUser((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "name" || name === "surname") {
      setErrors(prev => ({ ...prev, [name]: validateName(value) }));
    } else if (name === "email") {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "number") {
      setErrors(prev => ({ ...prev, number: validatePhoneNumber(value) }));
    }
  };

  const handlePhoneBlur = () => {
    setErrors(prev => ({ ...prev, number: validatePhoneNumber(editedUser.number) }));
  };

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const getCityDisplayById = (id) => {
    const c = cities.find(city => city.city_id === id);
    if (!c) return "Select City";
    return `${c.city_name}, ${c.state_name}, ${c.country_name}`;
  };

  const filteredCities = cities.filter(city =>
    `${city.city_name} ${city.state_name} ${city.country_name}`.toLowerCase().includes(citySearch.toLowerCase())
  );

  const groupedFilteredCities = filteredCities.reduce((acc, city) => {
    if (!acc[city.country_name]) acc[city.country_name] = [];
    acc[city.country_name].push(city);
    return acc;
  }, {});

  const isFormValid = () => {
    return (
      !validateName(editedUser.name) &&
      !validateName(editedUser.surname) &&
      !validateEmail(editedUser.email) &&
      !validatePhoneNumber(editedUser.number)
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      setErrors({
        name: validateName(editedUser.name),
        surname: validateName(editedUser.surname),
        email: validateEmail(editedUser.email),
        number: validatePhoneNumber(editedUser.number)
      });
      return;
    }
    const formData = new FormData();
    formData.append("name", editedUser.name);
    formData.append("surname", editedUser.surname);
    formData.append("email", editedUser.email);
    formData.append("number", editedUser.number);
    formData.append("city_id", editedUser.city_id);
    if (selectedFile) {
      formData.append("document_type", selectedFile);
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile/${user.email}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsEditing(false);
        setSelectedFile(null);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleCancel = () => {
    setEditedUser({
      ...user,
      city_id: user.city_id?.[0]?.city_id || user.city_id,
    });
    setErrors({ name: "", surname: "", email: "", number: "" });
    setIsEditing(false);
    setSelectedFile(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#056973]"
        ></motion.div>
      </div>
    );
  }

  const getCityDisplay = () => {
    if (!user.city_id || !user.city_id[0]) return "Not specified";
    const c = user.city_id[0];
    return `${c.city_name}, ${c.state_name}, ${c.country_name}`;
  };

  const completeness = (() => {
    let score = 0;
    if (user.name) score += 20;
    if (user.surname) score += 20;
    if (user.email) score += 20;
    if (user.number) score += 20;
    if (user.document_type) score += 20;
    return score;
  })();

  // Floating Particles for Header
  const particles = Array.from({ length: 6 });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans selection:bg-[#056973] selection:text-white">
      {/* Ultra Dynamic Animated Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#056973] text-white pt-8 pb-40 px-6 md:px-12 shadow-2xl relative overflow-hidden"
      >
        {/* Animated Mesh Gradients */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-gradient-to-br from-[#088b99] to-[#056973] rounded-full blur-[140px] opacity-40"
          ></motion.div>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -60, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[120%] bg-gradient-to-tr from-[#044a51] to-teal-400 rounded-full blur-[140px] opacity-30"
          ></motion.div>
        </div>

        {/* Floating Particles */}
        {particles.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100],
              x: [0, Math.sin(i) * 50],
              opacity: [0, 0.4, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
            className="absolute w-2 h-2 bg-white rounded-full z-0"
            style={{
              left: `${15 * i}%`,
              bottom: "-20px"
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.button
            whileHover={{ x: -8, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white font-bold transition-all mb-10 group bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/20 w-fit shadow-2xl shadow-black/10"
          >
            <ArrowLeft size={20} className="group-hover:scale-125 transition-transform" />
            Control Center
          </motion.button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-teal-200 text-xs font-black uppercase tracking-[0.2em]"
              >
                <Zap size={14} className="fill-teal-400 text-teal-400" /> System Access Granted
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
              >
                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">PROFILE</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-teal-50/60 text-xl font-bold max-w-2xl leading-relaxed"
              >
                Elevate your presence in the global auction arena. Manage credentials, track performance, and verify status.
              </motion.p>
            </div>

            {/* Profile Completion Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.4 }}
              className="relative w-40 h-40 flex items-center justify-center bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <motion.circle
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={364}
                  initial={{ strokeDashoffset: 364 }}
                  animate={{ strokeDashoffset: 364 - (364 * completeness) / 100 }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className="text-teal-400"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black leading-none">{completeness}%</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-teal-200 mt-1">Complete</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Avatar & Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>

              <div className="relative flex flex-col items-center">
                <motion.div
                  whileHover={{ rotate: [0, -2, 2, 0], scale: 1.02 }}
                  className="relative w-52 h-52 mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#056973] to-teal-300 rounded-[3rem] blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-full h-full rounded-[2.5rem] border-[10px] border-white shadow-xl overflow-hidden bg-slate-100">
                    <img
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : (editedUser.document_type || user.document_type)
                            ? `${import.meta.env.VITE_API_URL}/photos/profile/${editedUser.document_type || user.document_type}`
                            : "/default-avatar.png"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white cursor-pointer backdrop-blur-md transition-opacity duration-300">
                        <Camera size={40} className="mb-2" />
                        <span className="text-xs font-black uppercase tracking-widest">Update Photo</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </motion.div>

                {!isEditing && (
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{user.name} {user.surname}</h2>
                    <p className="text-slate-400 font-bold mb-6">{user.email}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${user.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>
                        {user.status || 'Verified'}
                      </span>

                    </div>
                  </div>
                )}

                {/* Edit Toggle Button */}
                <div className="mt-10 w-full">
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-slate-900/30 group"
                    >
                      <Edit2 size={20} /> Edit Identity
                      <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button onClick={handleSave} disabled={!isFormValid()} className="w-full py-5 bg-[#056973] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-50">
                        Commit Changes
                      </button>
                      <button onClick={handleCancel} className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* System Performance (New Stats) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/20 blur-3xl"></div>
              <h3 className="text-xs font-black text-teal-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <Activity size={16} /> Market Influence
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Win Rate</p>
                  <p className="text-3xl font-black tracking-tighter">{stats.winRate}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Items Won</p>
                  <p className="text-3xl font-black tracking-tighter">{stats.totalWins}</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                  <span>Reputation Score</span>
                  <span className="text-teal-400">{stats.reputation}/10</span>
                </div>
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400" style={{ width: `${stats.reputation * 10}%` }}></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Detailed Forms & Data */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="p-4 bg-teal-50 rounded-2xl text-[#056973]">
                  <Target size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Personal Core</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Base Identity Details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Information Blocks (Animated in view mode) */}
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10"
                    >
                      {/* Name Inputs */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                        <input type="text" name="name" value={editedUser.name || ""} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 focus:border-[#056973] outline-none font-black text-slate-800 bg-slate-50/50 transition-all" />
                        {errors.name && <p className="text-[9px] font-black text-rose-500 uppercase ml-4">{errors.name}</p>}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Surname</label>
                        <input type="text" name="surname" value={editedUser.surname || ""} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 focus:border-[#056973] outline-none font-black text-slate-800 bg-slate-50/50 transition-all" />
                        {errors.surname && <p className="text-[9px] font-black text-rose-500 uppercase ml-4">{errors.surname}</p>}
                      </div>
                      {/* Email Input */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input type="email" name="email" value={editedUser.email || ""} onChange={handleChange} className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 focus:border-[#056973] outline-none font-black text-slate-800 bg-slate-50/50 transition-all" />
                      </div>
                      {/* Phone Input */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input type="tel" name="number" value={editedUser.number || ""} onChange={handleChange} onBlur={handlePhoneBlur} className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 focus:border-[#056973] outline-none font-black text-slate-800 bg-slate-50/50 transition-all" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="viewing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                      {[
                        { label: "Name", value: `${user.name} ${user.surname}`, icon: <User size={20} /> },
                        { label: "Email", value: user.email, icon: <Mail size={20} /> },
                        { label: "Phone Number", value: user.number, icon: <Phone size={20} /> },
                        { label: "Location", value: getCityDisplay(), icon: <MapPin size={20} /> }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group transition-all"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-[#056973] group-hover:bg-[#056973] group-hover:text-white transition-colors duration-500">
                              {item.icon}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</span>
                          </div>
                          <p className="text-xl font-black text-slate-800 tracking-tight">{item.value}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Location Search Upgrade */}
                {isEditing && (
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Location</label>
                    <div className="relative">
                      <div
                        onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                        className={`w-full px-8 py-6 rounded-[2rem] border-2 bg-slate-50 cursor-pointer flex justify-between items-center transition-all ${cityDropdownOpen ? 'border-[#056973] bg-white ring-8 ring-teal-50' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="flex items-center gap-4">
                          <MapPin size={24} className="text-[#056973]" />
                          <span className="text-lg font-black text-slate-800">{editedUser.city_id ? getCityDisplayById(editedUser.city_id) : "Select Grid"}</span>
                        </div>
                        <Search size={22} className="text-slate-400" />
                      </div>

                      <AnimatePresence>
                        {cityDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="absolute z-50 mt-6 w-full bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100"
                          >
                            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
                              <Search size={24} className="text-slate-400" />
                              <input autoFocus type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Coordinate Scan..." className="w-full bg-transparent outline-none text-lg font-black text-slate-700" />
                            </div>
                            <div className="max-h-80 overflow-y-auto p-4 custom-scrollbar">
                              {Object.keys(groupedFilteredCities).sort().map(country => (
                                <div key={country} className="mb-6">
                                  <div className="px-5 py-2 text-[10px] font-black text-[#056973] uppercase tracking-[0.3em] bg-teal-50/50 rounded-2xl mb-3">{country}</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {groupedFilteredCities[country].map(city => (
                                      <div
                                        key={city.city_id}
                                        onClick={() => {
                                          handleChange({ target: { name: 'city_id', value: city.city_id } });
                                          setCityDropdownOpen(false);
                                          setCitySearch("");
                                        }}
                                        className={`px-6 py-4 rounded-2xl cursor-pointer font-bold text-sm transition-all ${editedUser.city_id === city.city_id ? 'bg-[#056973] text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'}`}
                                      >
                                        {city.city_name}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity Feed (Added Complexity) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                    <Activity size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Your Latest Actions</p>
                  </div>
                </div>
                <button className="text-[10px] font-black text-[#056973] uppercase tracking-widest hover:underline">View History</button>
              </div>

              <div className="space-y-6">
                {activities.length > 0 ? activities.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    className="flex items-center gap-6 p-6 rounded-[2rem] border border-slate-50 hover:bg-slate-50/50 transition-all"
                  >
                    <div className={`w-3 h-3 rounded-full ${item.type === 'win' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-400 font-bold">{item.detail}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Live Update</span>
                  </motion.div>
                )) : (
                  <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    No recent activity detected
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};