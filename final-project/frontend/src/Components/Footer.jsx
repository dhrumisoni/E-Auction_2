import React from "react";
import { Link } from "react-router-dom";
// import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
// import { IoSend } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className=" px-8 py-10 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand + Socials */}
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-1">
            <span className="olive-dark">eAuction</span>
          </h1>
          <div className="flex gap-4 text-2xl mt-4">
            {/* <FaFacebookF /> */}
            {/* <FaInstagram /> */}
            {/* <FaXTwitter /> */}
          </div>
          <p className="mt-8 text-lg olive-dark">2026 © eAuction</p>
          <p className="text-lg mt-2 olive-dark">
            Your trusted online auction marketplace
          </p>
          <p className="text-sm mt-3 text-gray-600">
            Bid with confidence on verified listings and secure payments.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-bold mb-4 text-xl olive-dark">Quick Links</h3>
          <ul className="space-y-2 text-lg">
            <li><Link to="/auctions" className="hover:text-blue-600">Auctions</Link></li>
            <li><Link to="/auctions" className="hover:text-blue-600">Buy</Link></li>
            <li><Link to="/placebid" className="hover:text-blue-600">Sell Your Item</Link></li>
            <li><Link to="/contactus" className="hover:text-blue-600">Contact Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-4 text-xl olive-dark">Contact</h3>
          <ul className="space-y-3 text-lg">
            <li>Phone: +1 234 567 890</li>
            <li>Email: support@eauction.com</li>
          </ul>
          <p className="text-sm mt-4 text-gray-600">
            Need help with bidding or listing? Reach out and we will assist you.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
