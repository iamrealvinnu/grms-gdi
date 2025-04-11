import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/image.jpeg";

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (marketDropdownRef.current && !marketDropdownRef.current.contains(event.target)) {
        setMarketDropDownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-slate-800 shadow-md w-full">
      <nav className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/dashboard">
            <img
              src={Logo}
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20 object-contain rounded"
            />
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* Navigation Menu */}
        <ul
          className={`md:flex md:items-center absolute md:static top-16 right-0 w-[200px] bg-gray-800 md:bg-transparent md:w-auto transition-all z-50 duration-300 ${
            menuOpen ? "flex flex-col" : "hidden"
          }`}
        >
          {isLoggedIn ? (
            <>
              {/* Accounts */}
              <li className="py-2 lg:py-0">
                <Link
                  to="/getAllaccount"
                  className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
                >
                  Accounts
                </Link>
              </li>

              {/* Campaign Dropdown */}
              <li className="relative py-2 lg:py-0" ref={marketDropdownRef}>
                <button
                  className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
                  onClick={() => {
                    setMarketDropDownOpen(!marketDropDownOpen);
                    setUserDropdownOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                >
                  Campaign ▼
                </button>
                {marketDropDownOpen && (
                  <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-auto min-w-[150px] mt-2 z-10">
                    <li>
                      <Link
                        to="/campaignDetails"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Campaign Details
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Other Links */}
              <li className="py-2 lg:py-0">
                <Link
                  to="/leadDetails"
                  className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
                >
                  Leads
                </Link>
              </li>

              <li className="py-2 lg:py-0">
                <Link
                  to="/getAllOpportunity"
                  className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
                >
                  Opportunity
                </Link>
              </li>

              <li className="py-2 lg:py-0">
                <Link
                  to="/getCustomerList"
                  className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
                >
                  Contact
                </Link>
              </li>

              <li className="py-2 lg:py-0">
                <Link
                  to="/getAllactivities"
                  className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
                >
                  Activities
                </Link>
              </li>

              <li className="py-2 lg:py-0">
                <Link
                  to="/dashboard"
                  className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
                >
                  Reports
                </Link>
              </li>

              {/* Admin Dropdown */}
              <li className="relative py-2 lg:py-0" ref={userDropdownRef}>
                <button
                  className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                >
                  Admin ▼
                </button>
                {userDropdownOpen && (
                  <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-auto min-w-[150px] mt-2 z-10">
                    <li>
                      <Link
                        to="/userCreate"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Add User
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/userGetAllList"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        List User
                      </Link>
                    </li>
                  </ul>
                )}
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
                  <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-auto min-w-[150px] mt-2 z-10">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Profile
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <li className="py-2 lg:py-0">
              <Link to="/" className="text-white hover:bg-gray-600 rounded px-4 py-2 block">
                Home
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
