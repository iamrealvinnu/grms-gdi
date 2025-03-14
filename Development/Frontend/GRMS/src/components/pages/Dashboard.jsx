//
// NAME:        Dashboard.jsx
// AUTHOR:      Krishna Murthy
// COMPANY:     GDI Nexus
// DATE:        02/12/2025
// PURPOSE:     Dashboard Page To User's Display
//

// Imports
import React, { useEffect, useState } from 'react'; // Importing React and hooks for state & effects
import withAuth from '../withAuth'; // Higher-order component (HOC) for authentication
import { jwtDecode } from 'jwt-decode'; // Library for decoding JWT tokens
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // State variables for storing user name, date, and day
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        // Decode the token to extract user information
        const decodedToken = jwtDecode(token);
        // Extract the given name from the token, fallback to "User" if not found
        const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || "User";
        setUserName(name);
      } catch (error) {
        console.error("Error decoding token:", error); // Log error if token decoding fails
      }
    }

    // Get the current date and format it as "DD/MM/YYYY"
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-GB')); // British format for date

    // Get the current day (e.g., "Monday", "Tuesday")
    setCurrentDay(today.toLocaleDateString('en-US', { weekday: 'long' }));
  }, []); // Empty dependency array ensures this runs only once when component mounts

  return (
    <div className="p-5">
      {/* Welcome Message Section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
        <p className="text-gray-600">{currentDate} &bull; {currentDay}</p>
      </div>

      {/* Dashboard Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Total Customers Card */}
        <div className="bg-orange-500 text-white shadow-md rounded-lg p-5 text-center cursor-pointer hover:shadow-lg transition"
        onClick={() => navigate("/clientDetails")}
        >
          <h5 className="text-lg font-semibold">Total Customers</h5>
          <p className="text-2xl font-bold">20</p> {/* Static data, can be replaced with API data */}
        </div>

        {/* Leads Card */}
        <div className="bg-violet-500 text-white shadow-md rounded-lg p-5 text-center cursor-pointer hover:shadow-lg transition">
          <h5 className="text-lg font-semibold">Leads</h5>
          <p className="text-2xl font-bold">5</p>
        </div>

        {/* Calendar Card (No number, just a title) */}
        <div className="bg-pink-500 text-white shadow-md rounded-lg p-5 text-center cursor-pointer hover:shadow-lg transition">
          <h5 className="text-lg font-semibold">Calendar</h5>
        </div>

        {/* Tasks Card */}
        <div className="bg-slate-500 text-white shadow-md rounded-lg p-5 text-center cursor-pointer hover:shadow-lg transition">
          <h5 className="text-lg font-semibold">Tasks</h5>
          <p className="text-2xl font-bold">8</p>
        </div>
        
      </div>
    </div>
  );
};

// Export the component wrapped with authentication protection
export default withAuth(Dashboard);
