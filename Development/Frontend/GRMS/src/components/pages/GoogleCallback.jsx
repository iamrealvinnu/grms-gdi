// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// function GoogleCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchGoogleAuth = async () => {
//       const queryParams = new URLSearchParams(location.search);
//       const token = queryParams.get("code"); // Get Google auth code

//       if (token) {
//         try {
//           // Send the token to the backend to verify & fetch user details
//           const response = await axios.post(
//             "https://grms-dev.gdinexus.com:49181/api/v1/User/external",
//             { token }, // Send only token; backend should validate & return user details
//             {
//               headers: { "Content-Type": "application/json" },
//             }
//           );

//           if (response.data.success) {
//             const { accessToken, refreshToken, user } = response.data.data;

//             // Store tokens in localStorage
//             localStorage.setItem("accessToken", accessToken);
//             localStorage.setItem("refreshToken", refreshToken);

//             // Store user details in localStorage
//             localStorage.setItem("source", user.source);
//             localStorage.setItem("nameIdentifier", user.nameIdentifier);
//             localStorage.setItem("givenName", user.givenName);
//             localStorage.setItem("surname", user.surname);
//             localStorage.setItem("email", user.email);

//             toast.success(`Welcome, ${user.givenName}! Login Successful`);

//             // Navigate to dashboard after successful login
//             navigate("/dashboard");
//           } else {
//             toast.error(response.data.message || "Authentication failed.");
//           }
//         } catch (error) {
//           toast.error(error.response?.data?.message || "Login failed. Try again.");
//         }
//       } else {
//         toast.error("No authentication code found.");
//       }
//     };

//     fetchGoogleAuth();
//   }, [location, navigate]);

//   return <div>Authenticating...</div>;
// }

// export default GoogleCallback;



import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchGoogleAuth = async () => {
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get("code"); // Extract auth code

      if (code) {
        try {
          const response = await axios.post(
            "https://grms-dev.gdinexus.com:49181/api/v1/User/external", // Your backend API
            { code }, 
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data.success) {
            const { accessToken, refreshToken, user } = response.data.data;

            // Store tokens
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("email", user.email);

            toast.success(`Welcome, ${user.givenName}!`);
            navigate("/dashboard"); // Redirect after login
          } else {
            toast.error(response.data.message || "Authentication failed.");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed.");
        }
      } else {
        toast.error("No authentication code found.");
      }
    };

    fetchGoogleAuth();
  }, [location, navigate]);

  return <div>Authenticating...</div>;
}

export default GoogleCallback;
