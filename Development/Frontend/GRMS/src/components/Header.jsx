//
// NAME:			  Header.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			Handles the navigation bar, including login/logout states and a dropdown menu.
//

// Import required dependencies
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Navigation and linking

function Header() {
  // State variables
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu visibility
  const [dropdownOpen, setDropdownOpen] = useState(false); // Profile dropdown visibility
  const dropdownRef = useRef(null); // Reference for handling outside clicks
  const navigate = useNavigate(); // Hook for navigation

  // Check if the user is logged in by looking for a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Convert token presence into a boolean
  }, []);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout function: Remove tokens and redirect to the home page
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove access token
    localStorage.removeItem("refreshToken"); // Remove refresh token
    setIsLoggedIn(false); // Update login state
    navigate("/"); // Redirect to home page
  };

  return (
    <header className="bg-slate-800 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        
        {/* Logo */}
        <div className="text-white text-2xl font-bold">Logo</div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰ {/* Hamburger menu icon */}
        </div>

        {/* Internal Header (When User is Logged In) */}
        {isLoggedIn && (
          <ul
            className={`md:flex md:items-center absolute md:static top-16 right-0 w-[200px] bg-gray-800 md:bg-transparent md:w-auto md:space-x-6 transition-all duration-300 ${
              menuOpen ? "flex flex-col" : "hidden"
            }`}
          >
            <li className="py-2 lg:py-0 text-center">
              <Link
                to="/dashboard"
                className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
              >
                Dashboard
              </Link>
            </li>
            <li className="py-2 lg:py-0 text-center">
              <Link
                to="/notification"
                className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
              >
                Notification
              </Link>
            </li>

            {/* Profile Dropdown Menu */}
            <li
              className="relative py-2 lg:py-0 text-center lg:text-left"
              ref={dropdownRef}
            >
              <button
                className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Profile ▼
              </button>
              {dropdownOpen && (
                <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-40 mt-2">
                  <li>
                    <Link
                      to="/profile"
                      className="block no-underline px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Profile
                    </Link>
                  </li>
                  <li
                    onClick={handleLogout}
                    className="block no-underline px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              )}
            </li>
          </ul>
        )}

        {/* External Header (When User is Not Logged In) */}
        {!isLoggedIn && (
          <ul
            className={`md:flex md:items-center absolute md:static top-16 right-0 w-[200px] bg-gray-800 md:bg-transparent md:w-auto md:space-x-6 transition-all duration-300 ${
              menuOpen ? "flex flex-col" : "hidden"
            }`}
          >
            <li className="py-2 lg:py-0 text-center">
              <Link
                to="/"
                className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
              >
                Home
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}

export default Header;
