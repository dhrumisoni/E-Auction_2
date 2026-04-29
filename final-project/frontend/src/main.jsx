import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import App from "./App.jsx";
import AnimatedAuth from "./Pages/AnimatedAuth.jsx";
import { AuthContext, AuthProvider } from "../Context/AuthContext.jsx";
import { Logout } from "./Pages/Logout.jsx";
import { Profile } from "./Pages/Profile.jsx";
import AuctionCard from "./Pages/AuctionsPage.jsx";
import BidDetails from "./Pages/BidDetails.jsx";
import About from "./Pages/AboutUs.jsx";
import ContactUs from "./Pages/ContactUs.jsx";
import SellForm from "./Pages/SellForm.jsx";
import AiMode from "./Pages/AiMode.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import { Toaster } from "react-hot-toast";

const Root = () => {
  let { isLoggedIn, isLoading } = useContext(AuthContext);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auctions" element={<AuctionCard />} />
        <Route path="/biddetails" element={<BidDetails />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route
          path="/placebid"
          element={isLoggedIn ? <SellForm /> : <Navigate to="/login" state={{ message: "Please login to continue" }} replace />}
        />
        <Route path="/aimode" element={<AiMode />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <AnimatedAuth page="login" />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <App /> : <AnimatedAuth page="signup" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <App />}
        />
        <Route path="/logout" element={!isLoggedIn ? <App /> : <Logout />} />

        {/* ================= ADMIN SIDE ================= */}
        <Route path="/admin/*" element={<AdminApp />} />

      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </StrictMode>
);
