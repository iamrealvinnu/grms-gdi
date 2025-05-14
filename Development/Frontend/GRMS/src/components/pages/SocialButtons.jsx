import React from "react";
import { generateCodeChallenge } from "../Utility/helper";

function SocialButtons() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const googleRedirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  const microsoftClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
  const microsoftRedirectUri = import.meta.env.VITE_MICROSOFT_REDIRECT_URI;

  const handleExternalLogin = async (provider) => {
    let authUrl = "";

    if (provider === "google") {
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
        googleRedirectUri
      )}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;
    } else if (provider === "microsoft") {
      const verifier = crypto.randomUUID().replace(/-/g, ""); // PKCE code_verifier
      const challenge = await generateCodeChallenge(verifier); // PKCE code_challenge
      localStorage.setItem("pkce_verifier", verifier); // Store verifier temporarily

      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${microsoftClientId}&response_type=code&redirect_uri=${encodeURIComponent(
        microsoftRedirectUri
      )}&response_mode=query&scope=openid%20profile%20email%20User.Read&code_challenge=${challenge}&code_challenge_method=S256&prompt=consent`;
      
    }

    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <div>
      {/* Google Login Button */}
      <button
        className="bg-gray-200 p-3 rounded-lg flex items-center justify-center gap-5 hover:opacity-90 disabled:opacity-70 w-full mb-2"
        onClick={() => handleExternalLogin("google")}
      >
        <img
          src="https://img.icons8.com/color/24/000000/google-logo.png"
          alt="Google"
        />
        Sign in with Google
      </button>

      {/* Microsoft Login Button */}
      <button
        className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-5 hover:opacity-90 w-full"
        onClick={() => handleExternalLogin("microsoft")}
      >
        <img
          src="https://img.icons8.com/color/24/000000/microsoft.png"
          alt="Microsoft"
        />
        Sign in with Microsoft
      </button>
    </div>
  );
}

export default SocialButtons;
