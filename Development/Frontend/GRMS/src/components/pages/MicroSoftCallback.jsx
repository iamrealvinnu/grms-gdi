import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const MicrosoftCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const alreadyHandled = useRef(false); // ✅ Prevents double invocation

  const microsoftClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
  const microsoftRedirectUri = import.meta.env.VITE_MICROSOFT_REDIRECT_URI;

  useEffect(() => {
    if (alreadyHandled.current) return; // ✅ Prevent duplicate calls
    alreadyHandled.current = true;

    const fetchMicrosoftAuth = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const verifier = localStorage.getItem("pkce_verifier");

      if (!code || !verifier) {
        toast.error("Missing code or verifier.");
        navigate("/");
        return;
      }

      try {
        // Step 1: Exchange code for tokens
        const tokenResponse = await axios.post(
          "https://login.microsoftonline.com/common/oauth2/v2.0/token",
          new URLSearchParams({
            client_id: microsoftClientId,
            grant_type: "authorization_code",
            code,
            redirect_uri: microsoftRedirectUri,
            code_verifier: verifier,
            scope: "openid profile email User.Read",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const { id_token, access_token } = tokenResponse.data;

        // Step 2: Decode ID token to extract user info
        const decoded = jwtDecode(id_token);
        console.log(
          "Decoded Microsoft Token:",
          JSON.stringify(decoded, null, 2)
        );

        // Step 3: Build payload for backend
        const requestData = {
          source: "microsoft",
          nameIdentifier: decoded.sub,
          givenName:
            decoded.given_name || decoded.name?.split(" ")[0] || "test",
          surname:
            decoded.family_name ||
            decoded.name?.split(" ").slice(1).join(" ") ||
            "test",
          email: decoded.email || decoded.preferred_username,
        };

        console.log("Request Data:", JSON.stringify(requestData, null, 2));

        // Step 4: Send to your backend
        const authResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/Auth/external`,
          requestData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (authResponse.data.success) {
          const { accessToken, refreshToken } = authResponse.data.data;

          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);

          toast.success("Login successful!");
          navigate("/dashboard");
        } else {
          toast.error(authResponse.data.message || "Authentication failed.");
          navigate("/");
        }
      } catch (error) {
        console.error(
          "Microsoft Auth Error:",
          error.response?.data || error.message
        );
        toast.error("Login failed. Please try again.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchMicrosoftAuth();
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <p>Authenticating with Microsoft...</p>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default MicrosoftCallback;
