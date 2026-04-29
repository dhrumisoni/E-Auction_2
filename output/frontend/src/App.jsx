import { useEffect, useState } from "react";
import api from "./api";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Button from "./Components/Button";
import Footer from "./Components/Footer.jsx";
import OnTop from "./Components/OnTop.jsx";
import AutoScroll from "./Components/AutoScroll.jsx";

function App() {
  useEffect(() => {
    const img = document.getElementById("highlight-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.classList.add("fade-in-blink");
            img.classList.remove("opacity-0");
          } else {
            img.classList.remove("fade-in-blink");
            img.classList.add("opacity-0");
          }
        });
      },
      { threshold: 0.3 }
    );

    if (img) observer.observe(img);
    return () => {
      if (img) observer.unobserve(img);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col pt-10 h-max bg-[#fdfaf8]">

        <OnTop />
        <Header />

        {/* ================= HERO SECTION ================= */}
        <section className="flex flex-col py-20 px-30">

          <div className="flex w-full items-center py-10">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col w-full"
            >
              <h3 className="font-bold text-3xl leading-snug">
                Secure{" "}
                <span className="text-4xl font-extrabold text-[#056973]">
                  Bidding,
                </span>{" "}
                Smart{" "}
                <span className="text-4xl font-extrabold text-[#056973]">
                  Winning
                </span>
              </h3>

              <h1 className="text-7xl font-extrabold mt-5 leading-tight">
                Buy and Sell
                <br />
                <span className="text-[#056973]">Bid of</span>
                <br />
                Your Choice!
              </h1>

              <div className="flex space-x-5 mt-10">
                <Button hrefLink="/auctions" btnName="Buy" colorName="purple" />
                <Button hrefLink="/placebid" btnName="Sell" colorName="purple" />

              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full flex justify-end"
            >
              <img
                src="/auction.webp"
                alt="auction"
                id="highlight-section"
                className="h-125 opacity-0 floating"
              />
            </motion.div>
          </div>

          {/* Auto Scrolling Logos */}
          <AutoScroll />

          {/* ================ BID WITH US SECTION ================ */}
          <div className="py-10 flex w-full items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col w-full"
            >
              <h3 className="font-bold text-3xl">
                Bid{" "}
                <span className="text-4xl font-extrabold text-[#056973]">
                  With
                </span>{" "}
                Us!
              </h3>

              <h1 className="text-6xl font-extrabold mt-5 leading-tight">
                Successfully launch
                <br />
                <span className="text-[#056973]">your best</span>
                <br />
                Biddd!!!
              </h1>

              {/* Feature List */}
              <div className="grid gap-6 mt-10">

                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <FeatureBox
                    icon="https://cdn1.iconfinder.com/data/icons/auction-1/512/auction-bid-bidding-09-512.png"
                    title="Auto Auction"
                  />
                  <FeatureBox
                    icon="https://cdn-icons-png.flaticon.com/512/4289/4289566.png"
                    title="Secure Transaction"
                  />
                </div>

                {/* Row 2 */}
                <FeatureBox
                  icon="https://cdn0.iconfinder.com/data/icons/people-connection/512/12-512.png"
                  title="Connect Globally"
                />
              </div>
            </motion.div>

            {/* Right gradient card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex justify-end items-center"
            >
              <div
                className="
      animated-image 
      w-[700px] h-[700px]
      sm:w-[340px] sm:h-[340px]
      md:w-[420px] md:h-[420px]
      lg:w-[550px] lg:h-[550px]
      xl:w-[650px] xl:h-[650px]
      2xl:w-[750px] 2xl:h-[750px]
      flex justify-center items-center
    "
              >
                <img
                  src="/online-auction.png"
                  alt="Auction"
                  className="w-[700px] h-[700px] object-contain drop-shadow-2xl
               hover:scale-105 transition-all duration-500"
                />
              </div>
            </motion.div>




          </div>

          {/* ======== NEURAL GLASS TIMELINE SECTION ======== */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="py-16 relative flex justify-center px-4 overflow-hidden"
          >
            {/* Background Neural Glows */}
            <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#056973]/10 rounded-full blur-[100px] -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#0fc9db]/10 rounded-full blur-[80px] -translate-y-1/2"></div>

            <div className="relative z-10 w-full max-w-5xl">
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">

                {/* Heading Area */}
                <div className="text-center mb-12">
                  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-4 text-gray-900">
                    Bid <span className="text-[#056973] inline-block hover:scale-105 transition-transform cursor-default">timeline</span>
                  </h2>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 leading-tight max-w-2xl mx-auto px-4">
                    We can enter at any point or help you all the <br />
                    <span className="text-gray-500 font-medium text-base sm:text-lg">way through the development cycle.</span>
                  </p>
                </div>

                {/* Main Content Area */}
                <div className="relative flex justify-center">

                  {/* Floating Badges */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 left-0 sm:left-10 z-20 bg-white/90 backdrop-blur shadow-md rounded-xl p-3 border border-[#056973]/10 hidden md:flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#056973] text-white flex items-center justify-center text-[10px] font-bold">1</div>
                    <span className="font-semibold text-xs text-gray-700">Real-time Verification</span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/4 right-0 z-20 bg-white/90 backdrop-blur shadow-md rounded-xl p-3 border border-[#0fc9db]/10 hidden lg:flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#0fc9db] text-white flex items-center justify-center text-[10px] font-bold">2</div>
                    <span className="font-semibold text-xs text-gray-700">AI Proxy Bidding</span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-6 left-0 sm:left-4 z-20 bg-white/90 backdrop-blur shadow-md rounded-xl p-3 border border-[#056973]/10 hidden lg:flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">3</div>
                    <span className="font-semibold text-xs text-gray-700">Secure Payments</span>
                  </motion.div>

                  {/* The Illustration */}
                  <div className="relative group max-w-3xl">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#056973] to-[#0fc9db] rounded-[1.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                    <img
                      src="https://www.wholesalescout.co.uk/wp-content/uploads/2020/12/police-auctions.png"
                      alt="Auction Process"
                      className="relative rounded-[1.3rem] w-full h-auto shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>

                </div>

                {/* Info Grid */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 border-t border-gray-100 pt-8">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-[#056973]">100%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Bids</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-indigo-500">Fast</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Auto-Scheduler</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-[#0fc9db]">Secure</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Featured Auctions */}
          <FeaturedAuctions />

          {/* Support Sections */}
          <SupportSection />

        </section>

        <Footer />
      </div>
    </>
  );
}

export default App;

/* ------------ EXTRA COMPONENTS ------------ */

function FeatureBox({ icon, title }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center p-3 bg-white/70 backdrop-blur-md rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="w-16 h-16 flex justify-center items-center rounded-full bg-white shadow">
        <img src={icon} className="w-10 h-10" />
      </div>
      <p className="ml-4 font-semibold">{title}</p>
    </motion.div>
  );
}

function SupportSection() {
  return (
    <div className="w-full flex flex-col py-10 justify-center">
      <div className="text-6xl font-bold text-center">
        <p>
          Always By <span className="text-[#056973]">Your Side</span>
        </p>
        <hr className="w-1/4 mx-auto my-5 border-[#056973]" />
        <p>Be the First to use eAuction!</p>
      </div>

      <div className="bg-gray-300/30 rounded-2xl p-10 mt-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "https://cdn-icons-png.flaticon.com/512/561/561127.png",
              title: "24/7 Support",
              description: "Our team is available anytime to answer your questions.",
              link: "/contactus",
            },
            {
              icon: "https://cdn-icons-png.flaticon.com/512/2910/2910762.png",
              title: "Secure Payments",
              description: "Your transactions are protected with modern security.",
              link: "/privacy-policy",
            },
            {
              icon: "https://cdn-icons-png.flaticon.com/512/1828/1828926.png",
              title: "Fast Help",
              description: "Quick response and easy issue tracking for every inquiry.",
              link: "/aimode",
            },
          ].map((item, index) => (
            <Link to={item.link} key={index} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="grid justify-center text-center gap-4 rounded-3xl bg-white p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <div className="rounded-full bg-gray-100 w-24 h-24 mx-auto shadow-inner flex items-center justify-center">
                  <img src={item.icon} className="w-12 h-12" alt={item.title} />
                </div>
                <p className="font-semibold text-lg text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedAuctions() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/bid/`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.id - a.id);
        setAuctions(sorted.slice(0, 3));
      })
      .catch(() => { });
  }, []);

  const getTimeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If it hasn't started yet
    if (now < start) {
      const diffMs = start - now;
      const d = Math.floor(diffMs / 864e5);
      const h = Math.floor((diffMs % 864e5) / 36e5);
      const m = Math.floor((diffMs % 36e5) / 6e4);
      if (d === 0 && h < 6) return { text: `Starts in ${h}h ${m}m`, isActive: false, urgency: "urgent" };
      return { text: `Starts in ${d}d ${h}h`, isActive: false, urgency: "normal" };
    }

    // If it's currently active
    if (now >= start && now < end) {
      const diffMs = end - now;
      const d = Math.floor(diffMs / 864e5);
      const h = Math.floor((diffMs % 864e5) / 36e5);
      const m = Math.floor((diffMs % 36e5) / 6e4);
      if (d === 0 && h < 24) return { text: `${h}h ${m}m left`, isActive: true, urgency: "live" };
      return { text: `${d}d ${h}h left`, isActive: true, urgency: "live" };
    }

    // If it has ended
    return { text: "Ended", isActive: false, urgency: "normal" };
  };

  if (auctions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full py-14"
    >
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold">
          Featured <span className="text-[#056973]">Auctions</span>
        </h2>
        <p className="text-gray-500 mt-3 text-lg">Discover trending items up for bid right now</p>
      </div>

      {/* Cards Grid */}
      <div className="auction-grid">
        {auctions.map((item, index) => {
          const ts = getTimeStatus(item.start_date, item.end_date);
          return (
            <div key={item.id} className="auction-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="auction-card-image-wrapper">
                <img
                  src={item.image1_url && item.image1_url !== "null" && item.image1_url.trim() !== "" ? `${import.meta.env.VITE_API_URL}/photos/bidsphotos/${item.image1_url}` : "https://placehold.co/600x400/e2e8f0/64748b?text=Auction+Item"}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Auction+Item"; }}
                  alt={item.title || "Auction Item"}
                  className="auction-card-image"
                />
                <div className="auction-card-image-overlay"></div>
                <div className={`auction-card-badge auction-badge-${ts.urgency}`}>
                  {ts.isActive && <span className="auction-badge-pulse"></span>}
                  <Clock size={12} />
                  <span>{ts.text}</span>
                </div>
                <div className="auction-card-hover-overlay">
                  <div className="auction-card-view-btn"><ArrowUpRight size={20} /></div>
                </div>
              </div>
              <div className="auction-card-content">
                <div className="auction-card-content-top">
                  <h2 className="auction-card-title">{item.title}</h2>
                  <div className="auction-card-meta">
                    <span className={`auction-card-status ${ts.text === 'Ended' ? 'status-ended' : !ts.isActive ? 'status-upcoming' : ''
                      }`}>
                      <span className="auction-status-dot"></span>
                      {ts.text === 'Ended'
                        ? 'Auction Ended'
                        : !ts.isActive
                          ? 'Upcoming'
                          : 'Live Bid'}
                    </span>
                    {item.currentBid && (
                      <span className="auction-card-price">₹{Number(item.currentBid).toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
                <Link
                  to="/biddetails"
                  state={{ item }}
                  className={`auction-card-bid-btn ${ts.text === 'Ended'
                    ? 'bg-gray-400 hover:bg-gray-500'
                    : !ts.isActive
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : ''
                    }`}
                >
                  <span>
                    {ts.text === 'Ended'
                      ? 'View Results'
                      : !ts.isActive
                        ? 'View Details'
                        : 'Place Your Bid'}
                  </span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      <div className="text-center mt-10">
        <Link to="/auctions" className="auction-card-bid-btn" style={{ display: "inline-flex", padding: "0.8rem 2.5rem" }}>
          <TrendingUp size={18} />
          <span>View All Auctions</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}

