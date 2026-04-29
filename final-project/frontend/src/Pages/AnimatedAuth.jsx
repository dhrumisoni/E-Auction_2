import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./Login";
import SignUpPage from "./SignUp";

const AnimatedAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setShowLogin(location.pathname === "/login");
  }, [location.pathname]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLogin, setShowLogin] = useState(location.pathname === "/login");

  const handleSwitch = () => {
    setIsAnimating(true);

    // Start overlay animation, wait for it to cover fully (e.g., 500ms)
    setTimeout(() => {
      const newPath = showLogin ? "/signup" : "/login";
      navigate(newPath, { replace: true }); // change URL
      setShowLogin(!showLogin); // switch page content AFTER animation covers
    }, 500);

    // Then hide overlay after animation ends (e.g., 1s total)
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated Overlay */}
      <div
        className={`absolute inset-0 bg-[#056973] z-50 transition-transform duration-500 ${isAnimating
            ? "translate-x-0"
            : showLogin
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
      />

      {/* Page Content */}
      <div className="relative z-10 w-full h-full">
        {showLogin ? (
          <LoginPage onSwitch={handleSwitch} />
        ) : (
          <SignUpPage onSwitch={handleSwitch} />
        )}
      </div>
    </div>
  );
};

export default AnimatedAuth;
