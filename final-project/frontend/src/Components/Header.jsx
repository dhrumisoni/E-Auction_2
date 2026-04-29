import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";

const Header = () => {
  let { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const originalOffset = navbar.offsetTop;
    let isFixed = false;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const navbarTop = navbar.getBoundingClientRect().top;

      if (navbarTop <= 0 && !isFixed) {
        navbar.style.position = "fixed";
        navbar.style.top = "0";
        navbar.style.left = "0";
        navbar.style.right = "0";
        navbar.style.zIndex = "50";
        isFixed = true;
      }

      if (currentScrollY <= originalOffset && isFixed) {
        navbar.style.position = "static";
        isFixed = false;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        id="navbar"
        className="navbar shadow-md border-b border-gray-200 flex items-center justify-between px-8 py-4 sticky top-0 z-50"
      >
        {/* Logo */}
        <div className="text-2xl font-bold olive-dark tracking-wide">
          <a href="/">
            eAuction
          </a>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 text-white font-medium">
          <a href="/" className="hover:text-indigo-600 transition">
            Home
          </a>
          <a href="/profile" className="hover:text-indigo-600 transition">
            Profile
          </a>
          <a href="/aimode" className="hover:text-indigo-600 transition">
            AI Mode
          </a>
          <a href="/contactus" className="hover:text-indigo-600 transition">
            Contact Us
          </a>
          <a href="/aboutus" className="hover:text-indigo-600 transition">
            About Us
          </a>
          <a href="/privacy-policy" className="hover:text-indigo-600 transition">
            Privacy Policy
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          {isLoggedIn ? (
            <Link
              to="/logout"
              className="btn-white border-[2px] border-white rounded-xl px-5 py-2 text-white font-medium hover:bg-white hover:text-[#056973] transition-all duration-200"
            >
              Logout
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-white border-[2px] border-white rounded-xl px-5 py-2 text-white font-medium hover:bg-white hover:text-[#056973] transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-white border-[2px] border-white rounded-xl px-5 py-2 text-white font-medium hover:bg-white hover:text-[#056973] transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
