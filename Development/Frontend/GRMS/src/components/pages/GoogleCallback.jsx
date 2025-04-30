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



import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleAuth = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get("code");

      if (!code) {
        toast.error("No authentication code found.");
        setLoading(false);
        return;
      }

      try {
        const requestData = { code, source: "google" };
        console.log("Sending Auth Request:", requestData);

        const response = await axios.post(
          "https://grms-dev.gdinexus.com:49181/api/v1/Auth/external",
          requestData,
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          const { accessToken, refreshToken, user } = response.data.data;

          // Store tokens
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Store user details
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }

          toast.success("Login successful!");
          navigate("/dashboard");
        } else {
          toast.error(response.data.message || "Authentication failed.");
        }
      } catch (error) {
        console.error("Auth Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Login failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleAuth();
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? <p>Authenticating...</p> : <p>Redirecting...</p>}
    </div>
  );
}

export default GoogleCallback;
