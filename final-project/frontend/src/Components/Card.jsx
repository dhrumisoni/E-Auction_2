import { useState } from "react";

// Elegant E-Auction Feature Cards (Enhanced UI + Shine + Glow + 3D Hover + Neon Border)

const features = [
  {
    title: "Live Bidding",
    desc: "Join auctions happening in real-time",
    icon: "https://cdn-icons-png.flaticon.com/512/992/992700.png",
  },
  {
    title: "Verified Sellers",
    desc: "Only trusted & verified profiles",
    icon: "https://cdn-icons-png.flaticon.com/512/992/992659.png",
  },
  {
    title: "Low Start Price",
    desc: "Bid from highly competitive rates",
    icon: "https://cdn-icons-png.flaticon.com/512/3208/3208750.png",
  },
  {
    title: "Auto-Bid System",
    desc: "System increases your bid automatically",
    icon: "https://cdn-icons-png.flaticon.com/512/4206/4206655.png",
  },
  {
    title: "Instant Alerts",
    desc: "Get notified instantly when outbid",
    icon: "https://cdn-icons-png.flaticon.com/512/3917/3917749.png",
  },
  {
    title: "Secure Payments",
    desc: "Encrypted & fully secured transactions",
    icon: "https://cdn-icons-png.flaticon.com/512/2889/2889676.png",
  },
  {
    title: "Fast Delivery",
    desc: "Quick dispatch after auction win",
    icon: "https://cdn-icons-png.flaticon.com/512/3500/3500833.png",
  },
  {
    title: "Global Audience",
    desc: "Buy & sell from anywhere in the world",
    icon: "https://cdn-icons-png.flaticon.com/512/1042/1042339.png",
  },
];

const Card = () => {
  const [feature] = useState(
    () => features[Math.floor(Math.random() * features.length)]
  );

  return (
    <div
      className="
      group
      card-3d-hover card-glow-hover neon-border-hover
      flex flex-col relative overflow-hidden border-0 rounded-3xl text-white p-4 w-56 h-32 
      justify-between navbar shadow-xl
      transition-all duration-300 ease-out
      mx-3
      hover:scale-110
      "
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className="absolute top-0 left-[-100%] w-full h-full 
          bg-gradient-to-r from-transparent via-white/30 to-transparent
          skew-x-12 animate-shine"
        ></div>
      </div>

      {/* Icon + Title */}
      <div className="flex items-center gap-3 z-10">
        <img
          src={feature.icon}
          className="w-10 h-10 drop-shadow-md group-hover:scale-110 transition-all duration-300"
          alt="feature-icon"
        />
        <h3 className="text-lg font-bold group-hover:tracking-wide transition-all duration-300">
          {feature.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm opacity-90 z-10 mt-1 group-hover:translate-x-1 transition-all duration-300">
        {feature.desc}
      </p>
    </div>
  );
};

export default Card;
