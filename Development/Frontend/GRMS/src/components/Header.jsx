//
// NAME:			  GetUserList.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  12/03/2025
// PURPOSE:			User Header List
//
//

// Imports

// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logo from "../assets/image.jpeg";

// function Header() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const userDropdownRef = useRef(null);
//   const profileDropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     setIsLoggedIn(!!token);
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
//         setUserDropdownOpen(false);
//       }
//       if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
//         setProfileDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     setIsLoggedIn(false);
//     navigate("/");
//     setMenuOpen(false); // Close menu on logout
//   };

//   // Function to close mobile menu when a nav item is clicked
//   const closeMobileMenu = () => {
//     setMenuOpen(false);
//   };

//   return (
//     <header className="bg-slate-800 shadow-md w-full">
//       <nav className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3 lg:px-8">
//         {/* Logo Section */}
//         <div className="flex items-center">
//           <Link to="/dashboard" onClick={closeMobileMenu}>
//             <img
//               src={Logo}
//               alt="Logo"
//               className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20 object-contain rounded"
//             />
//           </Link>
//         </div>

//         {/* Mobile Menu Icon */}
//         <div
//           className="md:hidden text-white text-2xl cursor-pointer"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ☰
//         </div>

//         {/* Navigation Menu */}
//         <ul
//           className={`md:flex md:items-center absolute md:static top-16 right-0 w-[200px] bg-gray-800 md:bg-transparent md:w-auto transition-all z-50 duration-300 ${
//             menuOpen ? "flex flex-col" : "hidden"
//           }`}
//         >
//           {isLoggedIn ? (
//             <>
//               {/* Accounts */}
//               <li className="py-2 lg:py-0">
//                 <Link
//                   to="/getAllaccount"
//                   className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={closeMobileMenu}
//                 >
//                   Accounts
//                 </Link>
//               </li>

//               {/* Campaign Dropdown */}
//               <li className=" py-2 lg:py-0">
//                 <Link
//                   to="/campaignDetails"
//                   className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={closeMobileMenu}
//                 >
//                   Campaign
//                 </Link>
//               </li>

//               {/* Other Links */}
//               <li className="py-2 lg:py-0">
//                 <Link
//                   to="/leadDetails"
//                   className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={closeMobileMenu}
//                 >
//                   Leads
//                 </Link>
//               </li>

//               <li className="py-2 lg:py-0">
//                 <Link
//                   to="/getAllOpportunity"
//                   className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={closeMobileMenu}
//                 >
//                   Opportunity
//                 </Link>
//               </li>

//               <li className="py-2 lg:py-0">
//                 <Link
//                   to="/getCustomerList"
//                   className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={closeMobileMenu}
//                 >
//                   Contact
//                 </Link>
//               </li>

//               <li className="py-2 lg:py-0">
//                 <Link
//                   to="/getAllactivities"
//                   className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={closeMobileMenu}
//                 >
//                   Activities
//                 </Link>
//               </li>

//               <li className="py-2 lg:py-0">
//                 <Link
//                   to="/dashboard"
//                   className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={closeMobileMenu}
//                 >
//                   Reports
//                 </Link>
//               </li>

//               {/* Admin Dropdown */}
//               <li className="relative py-2 lg:py-0" ref={userDropdownRef}>
//                 <button
//                   className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={() => {
//                     setUserDropdownOpen(!userDropdownOpen);
//                     setProfileDropdownOpen(false);
//                   }}
//                 >
//                   Admin ▼
//                 </button>
//                 {userDropdownOpen && (
//                   <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-auto min-w-[150px] mt-2 z-10">
//                     <li>
//                       <Link
//                         to="/userCreate"
//                         className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
//                         onClick={closeMobileMenu}
//                       >
//                         Add User
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/userGetAllList"
//                         className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
//                         onClick={closeMobileMenu}
//                       >
//                         List User
//                       </Link>
//                     </li>
//                   </ul>
//                 )}
//               </li>

//               {/* Profile Dropdown */}
//               <li className="relative py-2 lg:py-0" ref={profileDropdownRef}>
//                 <button
//                   className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
//                   onClick={() => {
//                     setProfileDropdownOpen(!profileDropdownOpen);
//                     setUserDropdownOpen(false);
//                   }}
//                 >
//                   Profile ▼
//                 </button>
//                 {profileDropdownOpen && (
//                   <ul className="absolute lg:right-0 bg-white shadow-md rounded-md w-auto min-w-[150px] mt-2 z-10">
//                     <li>
//                       <Link
//                         to="/profile"
//                         className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
//                         onClick={closeMobileMenu}
//                       >
//                         Profile
//                       </Link>
//                     </li>
//                     <li
//                       onClick={() => {
//                         handleLogout();
//                         closeMobileMenu();
//                       }}
//                       className="block px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
//                     >
//                       Logout
//                     </li>
//                   </ul>
//                 )}
//               </li>
//             </>
//           ) : (
//             <li className="py-2 lg:py-0">
//               <Link to="/" className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
//                 onClick={closeMobileMenu}
//               >
//                 Home
//               </Link>
//             </li>
//           )}
//         </ul>
//       </nav>
//     </header>
//   );
// }

// export default Header;


import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/image.jpeg";
import { jwtDecode } from "jwt-decode"; // Library for decoding JWT tokens
import { IoIosNotifications } from "react-icons/io";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    // Add padding to body when header is fixed
    document.body.style.paddingTop = "68px";
    return () => {
      document.body.style.paddingTop = "";
    };
  }, []);

  useEffect(() => {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const actualUserId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "User";
        setUserId(actualUserId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

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
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".menu-toggle")
      ) {
        setMenuOpen(false);
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
    setMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="bg-slate-800 shadow-md w-full fixed top-0 z-50 h-16">
      <nav className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3 lg:px-8 h-full">
        {/* Logo Section */}
        <div className="flex items-center h-full">
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            onClick={closeMobileMenu}
            className="h-full flex items-center"
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain rounded"
            />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="menu-toggle md:hidden text-white text-2xl cursor-pointer flex items-center h-full"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </div>

        {/* Navigation Menu - Scrollable on mobile */}
        <div
          ref={menuRef}
          className={`md:flex md:items-center fixed md:static top-16 right-0 h-[calc(100vh-4rem)] md:h-auto w-full md:w-auto bg-gray-800 md:bg-transparent transition-all duration-300 ease-in-out ${menuOpen ? "block overflow-y-auto" : "hidden"
            }`}
          style={{
            maxHeight: "calc(100vh - 4rem)",
            scrollbarWidth: "thin",
            scrollbarColor: "#4b5563 #1f2937",
          }}
        >
          <ul className="flex flex-col md:flex-row md:space-x-2">
            {isLoggedIn ? (
              <>
                {/* Accounts */}
                <li className="border-b md:border-b-0 border-gray-700">
                  <Link
                    to="/getAllaccount"
                    className="text-white no-underline hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={closeMobileMenu}
                  >
                    Accounts
                  </Link>
                </li>

                {/* Campaign */}
                <li className="border-b md:border-b-0 border-gray-700">
                  <Link
                    to="/campaignDetails"
                    className="text-white no-underline hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={closeMobileMenu}
                  >
                    Campaign
                  </Link>
                </li>

                {/* Leads */}
                <li className="border-b md:border-b-0 border-gray-700">
                  <Link
                    to="/leadDetails"
                    className="text-white no-underline hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={closeMobileMenu}
                  >
                    Leads
                  </Link>
                </li>

                {/* Opportunity */}
                <li className="border-b md:border-b-0 border-gray-700">
                  <Link
                    to="/getAllOpportunity"
                    className="text-white no-underline hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={closeMobileMenu}
                  >
                    Opportunity
                  </Link>
                </li>

                {/* Contact */}
                <li className="border-b md:border-b-0 border-gray-700">
                  <Link
                    to="/getCustomerList"
                    className="text-white no-underline hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </Link>
                </li>

                {/* Activities */}
                <li className="border-b md:border-b-0 border-gray-700">
                  <Link
                    to="/getAllactivities"
                    className="text-white no-underline hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={closeMobileMenu}
                  >
                    Activities
                  </Link>
                </li>

                {/* Reports */}
                <li className="border-b md:border-b-0 border-gray-700">
                  <Link
                    to="/dashboard"
                    className="text-white no-underline hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={closeMobileMenu}
                  >
                    Reports
                  </Link>
                </li>

                {/* Admin Dropdown */}
                <li
                  className="relative border-b md:border-b-0 border-gray-700"
                  ref={userDropdownRef}
                >
                  <button
                    className="w-full text-left text-white hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserDropdownOpen(!userDropdownOpen);
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Admin ▼
                  </button>
                  {userDropdownOpen && (
                    <ul className="md:absolute md:right-0 bg-white shadow-md rounded-md w-full md:w-auto min-w-[150px] z-10">
                      <li className="border-b border-gray-200">
                        <Link
                          to="/userCreate"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                          onClick={closeMobileMenu}
                        >
                          Add User
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/userGetAllList"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                          onClick={closeMobileMenu}
                        >
                          List User
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Profile Dropdown */}
                <li
                  className="relative border-b md:border-b-0 border-gray-700"
                  ref={profileDropdownRef}
                >
                  <button
                    className="w-full text-left text-white hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                  >
                    Profile ▼
                  </button>
                  {profileDropdownOpen && (
                    <ul className="md:absolute md:right-0 bg-white shadow-md rounded-md w-full md:w-auto min-w-[150px] z-10">
                      <li className="border-b border-gray-200">
                        <Link
                          to={`/profile/${userId}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                          onClick={closeMobileMenu}
                        >
                          Profile
                        </Link>
                      </li>
                      <li
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      >
                        Logout
                      </li>
                    </ul>
                  )}
                </li>
                <li className="border-b md:border-b-0 border-gray-700">
                  <Link
                    to="/notification"
                    className="text-white no-underline hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                  >
                    <IoIosNotifications size={24} />
                  </Link>
                </li>
              </>
            ) : (
              <li className="border-b md:border-b-0 border-gray-700">
                <Link
                  to="/"
                  className="text-white hover:bg-gray-600 rounded px-4 py-3 md:py-2 block"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
