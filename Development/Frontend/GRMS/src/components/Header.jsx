//
// NAME:			  Header.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			Handles the navigation bar, including login/logout states and a dropdown menu.
//

// Import required dependencies
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [marketDropDownOpen, setMarketDropDownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const marketDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check if the user is logged in by looking for a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Convert token presence into a boolean
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        marketDropdownRef.current &&
        !marketDropdownRef.current.contains(event.target)
      ) {
        setMarketDropDownOpen(false);
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
    localStorage.removeItem("refreshToken"); // Remove access token
    setIsLoggedIn(false); // Update login state
    navigate("/"); // Redirect to home page
  };

  return (
    <header className="bg-slate-800 shadow-md">
      <nav className="container-fluid mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">Logo</div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰{/* Hamburger menu icon */}
        </div>

        {/* Internal Header (When User is Logged In) */}
        {isLoggedIn && (
          <ul
            className={`md:flex md:items-center absolute md:static top-16 right-0 w-[200px] bg-gray-800 md:bg-transparent md:w-auto md:space-x-6 transition-all duration-300 ${
              menuOpen ? "flex flex-col" : "hidden"
            }`}
          >
            {/* User Management Dropdown */}
            <li className="relative py-2 lg:py-0" ref={userDropdownRef}>
              <button
                className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
              >
                User Management ▼
              </button>
              {userDropdownOpen && (
                <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-35 mt-2">
                  <li>
                    <Link
                      to="/userCreate"
                      className="block no-underline px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Add User
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/userGetAllList"
                      className="block no-underline px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      List User
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Market Management DropDown */}
            <li className="relative py-2 lg:py-0" ref={marketDropdownRef}>
              <button
                className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
                onClick={() => {
                  setMarketDropDownOpen(!marketDropDownOpen);
                  setUserDropdownOpen(false);
                  setProfileDropdownOpen(false);
                }}
              >
                Market Management ▼
              </button>
              {marketDropDownOpen && (
                <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-35 mt-2">
                  <li>
                    <Link
                      to="/marketingDetails"
                      className="block no-underline px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Campaign Details
                    </Link>
                  </li>
                </ul>
              )}
            </li>

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

            {/* Profile Dropdown */}
            <li className="relative py-2 lg:py-0" ref={profileDropdownRef}>
              <button
                className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setUserDropdownOpen(false);
                }}
              >
                Profile ▼
              </button>
              {profileDropdownOpen && (
                <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-35 mt-2">
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
