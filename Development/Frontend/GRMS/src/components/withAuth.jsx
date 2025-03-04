//
// NAME:			  withAuth.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  21/12/2025
// PURPOSE:			Once token is in LocalStorage, allow access to a specific page;
//                otherwise, redirect to the home page.
//

// Import necessary dependencies
import React, { useEffect } from "react"; // Import React and useEffect hook
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// Higher-Order Component (HOC) to handle authentication
const withAuth = (Component) => {
  // Define a new component that wraps the provided component
  const AuthComponent = (props) => {
    const navigate = useNavigate(); // React Router hook for navigation

    // Check if token exists in localStorage; if not, redirect to the home page
    useEffect(() => {
      const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
      console.log("accessToken", token); // Log token for debugging

      if (!token) {
        navigate("/"); // Redirect to the home page if token is missing
      }
    }, [navigate]); // Dependency array ensures this runs when component mounts

    // If token exists, render the wrapped component; otherwise, return null (prevents rendering)
    return localStorage.getItem("accessToken") ? <Component {...props} /> : null;
  };

  return AuthComponent; // Return the wrapped component
};

export default withAuth; // Export the HOC for use in other parts of the application
