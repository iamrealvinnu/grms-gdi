//
// NAME:			  authMonitor.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/26/2025
// PURPOSE:			User's Auth Integration Monitor for Auto Logout
//

// Importing necessary dependencies
import { useEffect } from "react"; // React hook to handle side effects
import { toast, ToastContainer } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS for styling notifications

// Define auto-logout time (15 minutes = 900,000 milliseconds)
const AUTO_LOGOUT_TIME = 15 * 60 * 1000;

// Function to reset activity timer (stores the latest activity time in localStorage)
const resetActivityTimer = () => {
  localStorage.setItem("lastActivity", Date.now()); // Save current timestamp as last activity
};

// Function to check for inactivity and log out if needed
const checkInactivity = () => {
  const lastActivity = localStorage.getItem("lastActivity"); // Get last activity timestamp from localStorage
  const token = localStorage.getItem("accessToken"); // Get authentication token from localStorage

  // If both token and last activity exist, check for inactivity
  if (token && lastActivity) {
    const elapsedTime = Date.now() - parseInt(lastActivity, 10); // Calculate time elapsed since last activity

    // If elapsed time exceeds auto-logout threshold
    if (elapsedTime >= AUTO_LOGOUT_TIME) {
      // Remove authentication tokens and last activity timestamp from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("lastActivity");

      // Display a warning notification to inform the user about session expiration
      toast.warn("Session expired! You have been logged out.", {
        position: "top-right", // Display toast in the top-right corner
        autoClose: 6000, // Toast disappears after 6 seconds
        hideProgressBar: false, // Show progress bar
        closeOnClick: true, // Allow closing on click
        pauseOnHover: true, // Pause toast timer when hovered
        draggable: true, // Allow dragging the toast
      });

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        window.location.href = "/"; // Redirect the user to the home page
      }, 3000);
    }
  }
};

// React component that monitors user activity and handles auto logout
const AuthMonitor = () => {
  useEffect(() => {
    // Function to set up event listeners for tracking user activity
    const setupInactivityListeners = () => {
      window.addEventListener("mousemove", resetActivityTimer); // Track mouse movement
      window.addEventListener("keypress", resetActivityTimer); // Track keyboard input
      window.addEventListener("click", resetActivityTimer); // Track mouse clicks
      resetActivityTimer(); // Initialize last activity timestamp
    };

    setupInactivityListeners(); // Set up event listeners when the component mounts

    // Start an interval to check inactivity every 60 seconds
    const interval = setInterval(checkInactivity, 60 * 1000);

    // Cleanup function (runs when the component unmounts)
    return () => {
      window.removeEventListener("mousemove", resetActivityTimer); // Remove mousemove listener
      window.removeEventListener("keypress", resetActivityTimer); // Remove keypress listener
      window.removeEventListener("click", resetActivityTimer); // Remove click listener
      clearInterval(interval); // Clear inactivity check interval
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return <ToastContainer />; // Render ToastContainer to display notifications
};

export default AuthMonitor; // Export the component for use in other parts of the application
