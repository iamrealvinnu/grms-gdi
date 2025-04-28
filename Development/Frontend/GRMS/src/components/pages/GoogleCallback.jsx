import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import  { jwtDecode }  from "jwt-decode"; // Corrected import


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
        // Step 1: Exchange code for Google tokens (via your backend or use Google OAuth directly)
        const tokenResponse = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            code,
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:5173/google/callback",
            grant_type: "authorization_code",
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
  
        const { id_token } = tokenResponse.data;
  
        // Step 2: Decode the token
        const decoded = jwtDecode(id_token);
        console.log("Decoded Google Token:", decoded);
  
        // Step 3: Build payload for your backend
        const requestData = {
          source: "google",
          nameIdentifier: decoded.sub,
          givenName: decoded.given_name,
          surname: decoded.family_name,
          email: decoded.email,
        };
  
        // Step 4: Send to your backend
        const response = await axios.post(
          "https://grms-dev.gdinexus.com:49181/api/v1/Auth/external",
          requestData,
          { headers: { "Content-Type": "application/json" } }
        );
  
        if (response.data.success) {
          const { accessToken, refreshToken } = response.data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          
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