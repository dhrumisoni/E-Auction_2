import { useEffect, useState } from "react";
import api from "../../api";
import { Clock, Search, Flame, ArrowUpRight, TrendingUp } from "lucide-react";
import Header from "../Components/Header";
import { Link } from "react-router-dom";

export default function AuctionListing() {
  const [auctions, setAuctions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/bid/`)
      .then((res) => res.json())
      .then((data) => {
        setAuctions(data);
        console.log(data);
      });
  }, []);

  const filteredAuctions = auctions.filter((item) => {
    // Hide auctions that don't have an image
    if (!item.image1_url || item.image1_url === "null" || item.image1_url === "undefined" || item.image1_url.trim() === "") return false;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

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

  return (
    <div className="min-h-screen auction-page-bg">
      <Header />

      {/* Hero Search Section */}
      <div className="auction-search-hero">
        <div className="absolute top-6 left-6 md:left-10 z-10">
          <a href="/" className="text-white hover:text-gray-200 font-semibold text-lg">
            ← Back
          </a>
        </div>
        <div className="auction-search-hero-inner">
          <h1 className="auction-search-title">
            Discover & Bid on
            <span className="auction-search-title-accent"> Premium Items</span>
          </h1>
          <p className="auction-search-subtitle">
            Find exclusive collectibles, luxury items, and rare treasures
          </p>

          {/* Search Bar */}
          <div className="auction-search-bar-wrapper">
            <div className="auction-search-bar">
              <Search size={20} className="auction-search-icon" />
              <input
                id="auction-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search auctions by title or description..."
                className="auction-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="auction-search-clear"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="auction-stats-row">
            <div className="auction-stat-chip">
              <Flame size={16} />
              <span>{filteredAuctions.filter(a => getTimeStatus(a.start_date, a.end_date).isActive).length} Live Auctions</span>
            </div>
            <div className="auction-stat-chip">
              <TrendingUp size={16} />
              <span>{filteredAuctions.length} Total Items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Grid */}
      <main className="auction-grid-container">
        {filteredAuctions.length === 0 ? (
          <div className="auction-empty-state">
            <div className="auction-empty-icon">🔍</div>
            <h3>No auctions found</h3>
            <p>Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="auction-grid">
            {filteredAuctions.map((item, index) => {
              const timeStatus = getTimeStatus(item.start_date, item.end_date);

              return (
                <div
                  key={item.id}
                  className={`auction-card ${hoveredCard === item.id ? "auction-card-hovered" : ""}`}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* Image Section */}
                  <div className="auction-card-image-wrapper">
                    <img
                      src={item.image1_url ? `${import.meta.env.VITE_API_URL}/photos/bidsphotos/${item.image1_url}` : "https://placehold.co/600x400?text=No+Image+Available"}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400?text=No+Image+Available"; }}
                      alt={item.title || "Auction Item"}
                      className="auction-card-image"
                    />
                    <div className="auction-card-image-overlay"></div>

                    {/* Status Badge */}
                    <div className={`auction-card-badge auction-badge-${timeStatus.urgency}`}>
                      {timeStatus.isActive && <span className="auction-badge-pulse"></span>}
                      <Clock size={12} />
                      <span>{timeStatus.text}</span>
                    </div>

                    {/* Hover overlay with arrow */}
                    <div className="auction-card-hover-overlay">
                      <div className="auction-card-view-btn">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="auction-card-content">
                    <div className="auction-card-content-top">
                      <h2 className="auction-card-title">{item.title}</h2>

                      <div className="auction-card-meta">
                        <span className={`auction-card-status ${
                          timeStatus.text === 'Ended' ? 'status-ended' : !timeStatus.isActive ? 'status-upcoming' : ''
                        }`}>
                          <span className="auction-status-dot"></span>
                          {timeStatus.text === 'Ended' 
                            ? 'Auction Ended' 
                            : !timeStatus.isActive 
                              ? 'Upcoming' 
                              : 'Live Bid'}
                        </span>
                        {item.currentBid && (
                          <span className="auction-card-price">
                            ₹{Number(item.currentBid).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/biddetails"
                      state={{ item }}
                      className={`auction-card-bid-btn ${
                        timeStatus.text === 'Ended' 
                          ? 'bg-gray-400 hover:bg-gray-500' 
                          : !timeStatus.isActive 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : ''
                      }`}
                    >
                      <span>
                        {timeStatus.text === 'Ended' 
                          ? 'View Results' 
                          : !timeStatus.isActive 
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
        )}
      </main>
    </div>
  );
}
